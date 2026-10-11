import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { PROGRAMS } from "@/lib/content";
import { getRazorpayClient } from "@/lib/razorpay";

const SITE_URL = "https://www.careerzeta.com";

/**
 * The enrollment itself was already created (or matched to an existing
 * one) back in /api/enroll/quote — this step just adds a payment and a
 * Razorpay link to it, for whichever amount the candidate picked.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { enrollmentId, paymentType } = body;

  if (
    !Number.isInteger(enrollmentId) ||
    (paymentType !== "full" && paymentType !== "registration")
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);
  if (!enrollment) {
    return NextResponse.json({ error: "enrollment_not_found" }, { status: 404 });
  }

  if (paymentType === "registration" && enrollment.registrationFeeAmount === null) {
    return NextResponse.json({ error: "registration_fee_not_available" }, { status: 400 });
  }
  const paymentAmountPaise =
    paymentType === "registration" ? enrollment.registrationFeeAmount! : enrollment.totalFee;

  const razorpay = getRazorpayClient();
  if (!razorpay) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const program = PROGRAMS.find((p) => p.slug === enrollment.programSlug);

  const [payment] = await db
    .insert(payments)
    .values({
      enrollmentId: enrollment.id,
      type: paymentType,
      amount: paymentAmountPaise,
      status: "created",
    })
    .returning();

  try {
    const link = await razorpay.paymentLink.create({
      amount: paymentAmountPaise,
      currency: "INR",
      accept_partial: false,
      customer: {
        name: enrollment.candidateName,
        email: enrollment.candidateEmail,
        contact: enrollment.candidatePhone,
      },
      notify: { email: true, sms: true },
      reference_id: `enrollment-${enrollment.id}-payment-${payment.id}`,
      notes: { enrollmentId: String(enrollment.id), paymentId: String(payment.id) },
      description: `${program?.name ?? enrollment.programSlug} — ${paymentType === "registration" ? "Registration Fee" : "Course Fee"} — CareerZeta`,
      callback_url: `${SITE_URL}/enroll/thank-you`,
      callback_method: "get",
    });

    await db
      .update(payments)
      .set({ razorpayPaymentLinkId: link.id, paymentLinkUrl: link.short_url })
      .where(eq(payments.id, payment.id));

    return NextResponse.json({ paymentLinkUrl: link.short_url });
  } catch (err) {
    console.error("Razorpay payment link creation failed:", err);
    return NextResponse.json({ error: "payment_link_failed" }, { status: 502 });
  }
}
