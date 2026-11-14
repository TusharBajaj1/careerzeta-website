import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { confirmPaymentPaid } from "@/lib/paymentConfirmation";
import { verifyEasebuzzWebhookSignature } from "@/lib/easebuzz";

/**
 * Easebuzz's Transaction Webhook: marks a payment (and its enrollment)
 * paid once the candidate completes checkout on a hosted payment link.
 * Mirrors app/api/webhooks/razorpay/route.ts — same confirmPaymentPaid
 * call, same "no payment row found" tolerance for links shared outside
 * the website. Easebuzz posts this as a form body (not JSON), matched
 * back to our payments row via easebuzzTxnId (the txnid we generated and
 * sent at initiateLink time), not any id Easebuzz itself assigns.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const fields = Object.fromEntries(new URLSearchParams(rawBody));

  if (!verifyEasebuzzWebhookSignature(fields)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  if (fields.status !== "success") {
    return NextResponse.json({ received: true });
  }

  const txnid = fields.txnid;
  const easebuzzPaymentId = fields.easepayid;
  const capturedAmount = Number(fields.amount);
  if (!txnid || !easebuzzPaymentId || !Number.isFinite(capturedAmount)) {
    return NextResponse.json({ error: "malformed_payload" }, { status: 400 });
  }

  const [payment] = await db.select().from(payments).where(eq(payments.easebuzzTxnId, txnid)).limit(1);

  if (!payment) {
    console.error(`Easebuzz webhook: no payment row for txnid ${txnid}`);
    return NextResponse.json({ received: true });
  }

  // confirmPaymentPaid no-ops if already paid — makes both Easebuzz's own
  // webhook retries and a prior manual "Mark as Paid" override harmless.
  await confirmPaymentPaid({
    paymentId: payment.id,
    // Easebuzz's amount field is rupees (not paise, unlike Razorpay) — the
    // captured amount it reports back must still be stored in paise.
    capturedAmountPaise: Math.round(capturedAmount * 100),
    gatewayPaymentId: easebuzzPaymentId,
  });

  return NextResponse.json({ received: true });
}
