import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { computeEnrollQuote } from "@/lib/enrollQuote";
import { isValidEmail, isValidMobile } from "@/lib/forms";
import { getRazorpayClient } from "@/lib/razorpay";

const SITE_URL = "https://www.careerzeta.com";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { programSlug, name, email, phone, couponCode, paymentType } = body;

  if (
    typeof programSlug !== "string" ||
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !isValidEmail(email) ||
    typeof phone !== "string" ||
    !isValidMobile(phone) ||
    (paymentType !== "full" && paymentType !== "registration")
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const quote = await computeEnrollQuote({ programSlug, email, phone, couponCode });
  if (!quote.ok) {
    return NextResponse.json(quote, { status: 400 });
  }
  const { program, finalFeePaise, registrationFeePaise, couponId, salesExecutive } = quote;

  const paymentAmountPaise = paymentType === "registration" ? registrationFeePaise : finalFeePaise;

  const razorpay = getRazorpayClient();
  if (!razorpay) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const [enrollment] = await db
    .insert(enrollments)
    .values({
      candidateName: name.trim(),
      candidateEmail: email.trim(),
      candidatePhone: phone.trim(),
      programSlug,
      couponId,
      salesExecutive,
      totalFee: finalFeePaise,
      status: "pending",
    })
    .returning();

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
      customer: { name: name.trim(), email: email.trim(), contact: phone.trim() },
      notify: { email: true, sms: true },
      reference_id: `enrollment-${enrollment.id}-payment-${payment.id}`,
      notes: { enrollmentId: String(enrollment.id), paymentId: String(payment.id) },
      description: `${program.name} — ${paymentType === "registration" ? "Registration Fee" : "Course Fee"} — CareerZeta`,
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
