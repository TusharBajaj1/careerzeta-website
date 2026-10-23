import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { rupeesToPaise } from "@/lib/money";
import { confirmPaymentPaid } from "@/lib/paymentConfirmation";

/**
 * Manual override for a payment that didn't go through the Razorpay
 * webhook — e.g. a payment link the sales team shared directly over
 * email/WhatsApp (the webhook should already catch this automatically,
 * but this covers a delayed/misconfigured webhook), or money collected
 * outside Razorpay entirely, possibly for a different amount than the
 * link was originally generated for. Runs the exact same confirmation
 * logic as the webhook: marks the payment paid for whatever amount is
 * given, updates the enrollment, bumps coupon usage, and emails the
 * invoice to the candidate + accounting.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const paymentId = Number(id);
  if (!Number.isInteger(paymentId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const { amount } = body;
  if (amount !== undefined && (typeof amount !== "number" || amount <= 0)) {
    return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
  }

  const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
  if (!payment) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const capturedAmountPaise = typeof amount === "number" ? rupeesToPaise(amount) : payment.amount;

  const result = await confirmPaymentPaid({ paymentId, capturedAmountPaise });
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
