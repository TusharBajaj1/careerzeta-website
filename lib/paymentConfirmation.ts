import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { coupons, enrollments, payments } from "@/lib/db/schema";
import { sendPaymentInvoice } from "@/lib/invoiceEmail";

export type ConfirmPaymentResult =
  | { ok: true }
  | { ok: false; reason: "already_paid" | "payment_not_found" };

/**
 * Marks a payment row paid, rolls the amount into its enrollment, bumps
 * coupon usage on the enrollment's first successful payment, and emails
 * the invoice — the one place this happens, shared by the Razorpay
 * webhook (automatic) and the admin's manual "Mark as Paid" override
 * (for a payment link shared directly over email/WhatsApp rather than
 * through the website, or money collected outside Razorpay entirely).
 */
export async function confirmPaymentPaid(params: {
  paymentId: number;
  capturedAmountPaise: number;
  razorpayPaymentId?: string | null;
}): Promise<ConfirmPaymentResult> {
  const { paymentId, capturedAmountPaise, razorpayPaymentId } = params;

  const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
  if (!payment) {
    return { ok: false, reason: "payment_not_found" };
  }
  if (payment.status === "paid") {
    return { ok: false, reason: "already_paid" };
  }

  const paidAt = new Date();
  const [updatedPayment] = await db
    .update(payments)
    // amount is overwritten to what was actually received — may differ from
    // the amount the payment link/row was originally created for (e.g. a
    // manual confirm where the candidate paid a different amount outside
    // Razorpay), so the stored record and invoice reflect reality.
    .set({ status: "paid", amount: capturedAmountPaise, razorpayPaymentId: razorpayPaymentId ?? null, paidAt })
    .where(eq(payments.id, paymentId))
    .returning();

  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.id, payment.enrollmentId))
    .limit(1);

  if (!enrollment) {
    return { ok: true };
  }

  // A coupon is "used" once its enrollment makes its first successful
  // payment — not per-payment, since one coupon covers the whole
  // enrollment even when it's paid in a registration-fee + balance split.
  if (enrollment.couponId && enrollment.amountPaid === 0) {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.id, enrollment.couponId)).limit(1);
    if (coupon) {
      await db.update(coupons).set({ usedCount: coupon.usedCount + 1 }).where(eq(coupons.id, coupon.id));
    }
  }

  const amountPaid = enrollment.amountPaid + capturedAmountPaise;
  const status = amountPaid >= enrollment.totalFee ? "fully_paid" : "registration_paid";

  const [updatedEnrollment] = await db
    .update(enrollments)
    .set({ amountPaid, status })
    .where(eq(enrollments.id, enrollment.id))
    .returning();

  try {
    const { invoiceNumber, sent } = await sendPaymentInvoice(updatedPayment, updatedEnrollment);
    await db.update(payments).set({ invoiceSent: sent, invoiceNumber }).where(eq(payments.id, paymentId));
  } catch (err) {
    console.error(`Invoice email failed for payment ${paymentId}:`, err);
  }

  return { ok: true };
}
