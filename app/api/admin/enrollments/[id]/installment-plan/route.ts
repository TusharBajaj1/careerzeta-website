import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { PROGRAMS } from "@/lib/content";
import { generatePaymentLink, isGatewayConfigured } from "@/lib/createPaymentLink";

const ALLOWED_MONTHS = new Set([2, 3, 6, 9]);
const GATEWAYS = new Set(["razorpay", "easebuzz"]);

/**
 * Splits an enrollment's remaining balance (after however much has already
 * been paid — typically just the registration fee) into N equal monthly
 * installments, each its own payment row with a real gateway link
 * generated up front. The sales team shares each link as its month comes
 * due, or marks it paid directly (the existing per-row "Mark as Paid"/
 * payment-link controls already work on any payment row regardless of
 * type, so nothing new is needed there). "manual" isn't offered as a
 * gateway here — these are payments due in the future, not money already
 * collected, so there's nothing to mark paid yet.
 *
 * The last installment absorbs the paise lost to rounding so the N
 * amounts always sum to exactly the remaining balance. Due dates are
 * spaced one calendar month apart starting next month — an estimate the
 * team can work around, not something anything automated reads yet.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const enrollmentId = Number(id);
  if (!Number.isInteger(enrollmentId)) {
    return NextResponse.json({ error: "invalid_enrollment_id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const months = body?.months;
  const gateway = body?.gateway;
  if (!ALLOWED_MONTHS.has(months) || !GATEWAYS.has(gateway)) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);
  if (!enrollment) {
    return NextResponse.json({ error: "enrollment_not_found" }, { status: 404 });
  }

  const remaining = enrollment.totalFee - enrollment.amountPaid;
  if (remaining <= 0) {
    return NextResponse.json({ error: "nothing_remaining" }, { status: 400 });
  }
  if (!isGatewayConfigured(gateway)) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;
  const base = Math.floor(remaining / months);
  const roundingRemainder = remaining - base * months;

  const created = [];
  for (let i = 0; i < months; i++) {
    const amount = i === months - 1 ? base + roundingRemainder : base;
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + i + 1);

    const [payment] = await db
      .insert(payments)
      .values({
        enrollmentId: enrollment.id,
        type: "installment",
        amount,
        status: "created",
        gateway,
        installmentNumber: i + 1,
        installmentTotal: months,
        dueDate,
      })
      .returning();

    try {
      const updated = await generatePaymentLink({
        enrollment,
        payment,
        gateway,
        description: `${programName} — Installment ${i + 1} of ${months} — CareerZeta`,
      });
      created.push(updated);
    } catch (err) {
      console.error(`Installment ${i + 1}/${months} link creation failed for enrollment ${enrollment.id}:`, err);
      created.push(payment);
    }
  }

  return NextResponse.json({ payments: created });
}
