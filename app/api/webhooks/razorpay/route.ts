import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { confirmPaymentPaid } from "@/lib/paymentConfirmation";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";

/**
 * Razorpay webhook: marks a payment (and its enrollment) paid once the
 * candidate completes checkout on a hosted payment link. Covers both the
 * public full-fee flow (/api/enroll) and admin-created registration/balance
 * links (task #44), since both write a `payments` row with the link ID
 * before the candidate ever sees the link — including links the sales team
 * shares directly over email/WhatsApp rather than through the website,
 * since this fires off the payment link itself, not website traffic.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  // Only payment_link.paid is wired up today — every link we create has
  // accept_partial:false, so "paid" always means paid in full for that link.
  if (event.event !== "payment_link.paid") {
    return NextResponse.json({ received: true });
  }

  const linkId: string | undefined = event.payload?.payment_link?.entity?.id;
  const paymentEntity = event.payload?.payment?.entity;
  const razorpayPaymentId: string | undefined = paymentEntity?.id;
  const capturedAmount: number | undefined = paymentEntity?.amount;
  if (!linkId || !razorpayPaymentId || typeof capturedAmount !== "number") {
    return NextResponse.json({ error: "malformed_payload" }, { status: 400 });
  }

  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.razorpayPaymentLinkId, linkId))
    .limit(1);

  if (!payment) {
    console.error(`Razorpay webhook: no payment row for payment link ${linkId}`);
    return NextResponse.json({ received: true });
  }

  // confirmPaymentPaid no-ops if already paid — makes both Razorpay's own
  // webhook retries and a prior manual "Mark as Paid" override harmless.
  await confirmPaymentPaid({ paymentId: payment.id, capturedAmountPaise: capturedAmount, razorpayPaymentId });

  return NextResponse.json({ received: true });
}
