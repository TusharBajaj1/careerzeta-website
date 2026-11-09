import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { recomputeEnrollmentTotals } from "@/lib/paymentConfirmation";

/**
 * Moves a *paid* payment onto a different enrollment — for the case where
 * the team recorded a real payment against the wrong enrollment (wrong
 * candidate picked from the list, wrong Razorpay link shared, etc.). Both
 * enrollments' amountPaid/status are recomputed from their actual payment
 * rows afterward, rather than patched arithmetically.
 *
 * Deliberately does NOT re-send an invoice to the correct candidate — the
 * original invoice was already issued (to the wrong enrollment's details)
 * and GST rules mean fixing that is a credit-note-plus-fresh-invoice
 * question for accounting to decide, not something to silently automate.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paymentId = Number(id);
  if (!Number.isInteger(paymentId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const targetEnrollmentId = body?.targetEnrollmentId;
  if (!Number.isInteger(targetEnrollmentId)) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
  if (!payment) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (payment.status !== "paid") {
    return NextResponse.json({ error: "payment_not_paid" }, { status: 400 });
  }
  if (payment.enrollmentId === targetEnrollmentId) {
    return NextResponse.json({ error: "same_enrollment" }, { status: 400 });
  }

  const [targetEnrollment] = await db.select().from(enrollments).where(eq(enrollments.id, targetEnrollmentId)).limit(1);
  if (!targetEnrollment) {
    return NextResponse.json({ error: "target_not_found" }, { status: 404 });
  }

  const previousEnrollmentId = payment.enrollmentId;

  await db.update(payments).set({ enrollmentId: targetEnrollmentId }).where(eq(payments.id, paymentId));
  await recomputeEnrollmentTotals(previousEnrollmentId);
  await recomputeEnrollmentTotals(targetEnrollmentId);

  return NextResponse.json({ ok: true });
}
