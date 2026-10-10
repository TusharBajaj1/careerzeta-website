import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { validateCoupon } from "@/lib/coupons";
import { isValidEmail, isValidMobile } from "@/lib/forms";
import { PROGRAMS } from "@/lib/content";
import { PROGRAM_DETAILS } from "@/lib/programsDetail";
import { parseFeeStringToRupees, rupeesToPaise } from "@/lib/money";
import { getRazorpayClient } from "@/lib/razorpay";

const SITE_URL = "https://www.careerzeta.com";

/**
 * Public enrollment flow: always full payment (minus any valid coupon
 * discount). Sales-negotiated partial/registration-fee payments are
 * admin-only (see /admin/enrollments) — not exposed here, since a public
 * form can't be trusted to decide who gets to pay less upfront.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { programSlug, name, email, phone, couponCode } = body;

  if (
    typeof programSlug !== "string" ||
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !isValidEmail(email) ||
    typeof phone !== "string" ||
    !isValidMobile(phone)
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const program = PROGRAMS.find((p) => p.slug === programSlug);
  const detail = PROGRAM_DETAILS.find((d) => d.slug === programSlug);
  if (!program || !detail) {
    return NextResponse.json({ error: "invalid_program" }, { status: 400 });
  }

  const feeRupees = parseFeeStringToRupees(detail.fee);
  if (!feeRupees) {
    return NextResponse.json({ error: "program_not_available_for_enrollment" }, { status: 400 });
  }
  const originalFeePaise = rupeesToPaise(feeRupees);

  let discountPaise = 0;
  let couponId: number | null = null;

  if (typeof couponCode === "string" && couponCode.trim()) {
    const result = await validateCoupon({
      code: couponCode,
      candidateEmail: email,
      candidatePhone: phone,
      programSlug,
      originalFeePaise,
    });
    if (!result.valid) {
      return NextResponse.json({ error: "invalid_coupon", reason: result.reason }, { status: 400 });
    }
    discountPaise = result.discountPaise;
    couponId = result.coupon.id;
  }

  const finalFeePaise = originalFeePaise - discountPaise;

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
      totalFee: finalFeePaise,
      status: "pending",
    })
    .returning();

  const [payment] = await db
    .insert(payments)
    .values({
      enrollmentId: enrollment.id,
      type: "full",
      amount: finalFeePaise,
      status: "created",
    })
    .returning();

  try {
    const link = await razorpay.paymentLink.create({
      amount: finalFeePaise,
      currency: "INR",
      accept_partial: false,
      customer: { name: name.trim(), email: email.trim(), contact: phone.trim() },
      notify: { email: true, sms: true },
      reference_id: `enrollment-${enrollment.id}-payment-${payment.id}`,
      notes: { enrollmentId: String(enrollment.id), paymentId: String(payment.id) },
      description: `${program.name} — CareerZeta`,
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
