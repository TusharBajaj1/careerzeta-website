import { and, eq } from "drizzle-orm";

import { ensureAdmissionNumber } from "@/lib/admissionNumber";
import { db } from "@/lib/db";
import { coupons, enrollments, payments } from "@/lib/db/schema";
import { sendAdmissionLetter } from "@/lib/admissionLetterEmail";
import { sendPaymentInvoice } from "@/lib/invoiceEmail";

export type ConfirmPaymentResult =
  | { ok: true }
  | { ok: false; reason: "already_paid" | "payment_not_found" };

/** The status implied by payment progress alone — what "undo refund request" reverts to, and what a recompute lands on. */
export function paymentDerivedStatus(
  amountPaid: number,
  totalFee: number,
): "pending" | "registration_paid" | "fully_paid" {
  if (amountPaid >= totalFee) return "fully_paid";
  if (amountPaid > 0) return "registration_paid";
  return "pending";
}

/**
 * Recomputes an enrollment's amountPaid from its actual paid payment rows,
 * rather than incrementing/decrementing a running total — used after a
 * payment moves to a different enrollment (see /api/admin/payments/[id]/reassign),
 * so both enrollments end up exactly consistent with their real payment
 * history instead of relying on arithmetic that could drift. Leaves a
 * cancelled/refund_requested status alone — those are manual states, not
 * ones payment progress should silently overwrite.
 */
export async function recomputeEnrollmentTotals(enrollmentId: number): Promise<void> {
  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);
  if (!enrollment) return;

  const paidPayments = await db
    .select()
    .from(payments)
    .where(and(eq(payments.enrollmentId, enrollmentId), eq(payments.status, "paid")));
  const amountPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0);

  const status =
    enrollment.status === "cancelled" || enrollment.status === "refund_requested"
      ? enrollment.status
      : paymentDerivedStatus(amountPaid, enrollment.totalFee);

  await db.update(enrollments).set({ amountPaid, status }).where(eq(enrollments.id, enrollmentId));
}

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
  /** The gateway's own id for the completed transaction — written to razorpayPaymentId or easebuzzPaymentId depending on this payment row's own `gateway`, not on which webhook called this. */
  gatewayPaymentId?: string | null;
}): Promise<ConfirmPaymentResult> {
  const { paymentId, capturedAmountPaise, gatewayPaymentId } = params;

  const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
  if (!payment) {
    return { ok: false, reason: "payment_not_found" };
  }
  if (payment.status === "paid") {
    return { ok: false, reason: "already_paid" };
  }

  const paidAt = new Date();
  const gatewayIdColumn =
    payment.gateway === "easebuzz"
      ? { easebuzzPaymentId: gatewayPaymentId ?? null }
      : { razorpayPaymentId: gatewayPaymentId ?? null };
  const [updatedPayment] = await db
    .update(payments)
    // amount is overwritten to what was actually received — may differ from
    // the amount the payment link/row was originally created for (e.g. a
    // manual confirm where the candidate paid a different amount outside
    // the gateway), so the stored record and invoice reflect reality.
    .set({ status: "paid", amount: capturedAmountPaise, ...gatewayIdColumn, paidAt })
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
    const { invoiceNumber, sent, pdfUrl } = await sendPaymentInvoice(updatedPayment, updatedEnrollment);
    await db
      .update(payments)
      .set({ invoiceSent: sent, invoiceNumber, invoicePdfUrl: pdfUrl })
      .where(eq(payments.id, paymentId));
  } catch (err) {
    console.error(`Invoice email failed for payment ${paymentId}:`, err);
  }

  if (updatedEnrollment.status === "fully_paid") {
    // Assigned the moment admission actually happens — independent of
    // whether the letter email below succeeds, since being admitted is
    // the real event, not sending the letter about it.
    if (!updatedEnrollment.admissionNumber) {
      try {
        updatedEnrollment.admissionNumber = await ensureAdmissionNumber(updatedEnrollment);
      } catch (err) {
        console.error(`Admission number assignment failed for enrollment ${updatedEnrollment.id}:`, err);
      }
    }

    // Fires exactly once, the moment an enrollment first reaches fully_paid —
    // guarded by admissionLetterSent so a later payment-related recompute on
    // this same enrollment (e.g. a reassign) never resends it.
    if (!updatedEnrollment.admissionLetterSent) {
      try {
        const { sent, pdfUrl } = await sendAdmissionLetter(updatedEnrollment);
        await db
          .update(enrollments)
          .set({ admissionLetterSent: sent, admissionLetterSentAt: new Date(), admissionLetterPdfUrl: pdfUrl })
          .where(eq(enrollments.id, updatedEnrollment.id));
      } catch (err) {
        console.error(`Admission letter failed for enrollment ${updatedEnrollment.id}:`, err);
      }
    }
  }

  return { ok: true };
}
