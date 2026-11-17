import { and, eq } from "drizzle-orm";

import { ensureAdmissionNumber } from "@/lib/admissionNumber";
import { db } from "@/lib/db";
import { coupons, enrollments, payments } from "@/lib/db/schema";

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
 * Marks a payment row paid, rolls the amount into its enrollment, and
 * bumps coupon usage on the enrollment's first successful payment —
 * shared by the Razorpay/Easebuzz webhooks (automatic) and the admin's
 * manual "Mark as Paid" override (for a payment link shared directly
 * over email/WhatsApp rather than through the website, or money
 * collected outside the gateway entirely).
 *
 * Does NOT send the invoice, registration-confirmation, or admission
 * letter emails — those are deliberately manual-only (team request, to
 * stop mistaken auto-sends); trigger them from the admin panel's
 * Send/Resend controls instead. Admission numbers still get assigned
 * automatically below, since that's a real data event (this candidate
 * is admitted), not an email.
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
  await db
    .update(payments)
    // amount is overwritten to what was actually received — may differ from
    // the amount the payment link/row was originally created for (e.g. a
    // manual confirm where the candidate paid a different amount outside
    // the gateway), so the stored record and invoice reflect reality.
    .set({ status: "paid", amount: capturedAmountPaise, ...gatewayIdColumn, paidAt })
    .where(eq(payments.id, paymentId));

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
  const isFirstPaymentOnEnrollment = enrollment.amountPaid === 0;
  if (enrollment.couponId && isFirstPaymentOnEnrollment) {
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

  // Invoice, registration-confirmation, and admission-letter emails are
  // intentionally NOT sent from here — send them manually from the admin
  // panel (Enrollments: Send invoice / Send registration letter / Send
  // admission letter).

  if (updatedEnrollment.status === "fully_paid" && !updatedEnrollment.admissionNumber) {
    // Assigned the moment admission actually happens — independent of
    // whether/when the letter is sent, since being admitted is the real,
    // already-irreversible event, not an email about it.
    try {
      await ensureAdmissionNumber(updatedEnrollment);
    } catch (err) {
      console.error(`Admission number assignment failed for enrollment ${updatedEnrollment.id}:`, err);
    }
  }

  return { ok: true };
}
