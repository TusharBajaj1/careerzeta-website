import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { PROGRAMS } from "@/lib/content";
import { isValidEmail, isValidMobile } from "@/lib/forms";
import { getRazorpayClient } from "@/lib/razorpay";
import {
  createEasebuzzPaymentLink,
  generateEasebuzzTxnId,
  isEasebuzzConfigured,
  sanitizeEasebuzzPhone,
  sanitizeEasebuzzProductInfo,
} from "@/lib/easebuzz";

const SITE_URL = "https://www.careerzeta.com";
const GATEWAYS = new Set(["razorpay", "easebuzz"]);

/**
 * The enrollment itself was already created (or matched to an existing
 * one) back in /api/enroll/quote — this step just adds a payment and a
 * Razorpay link to it, for whichever amount the candidate picked.
 *
 * enrollmentId is a sequential, guessable id, and /api/enroll/quote can
 * return someone else's existing enrollment to anyone who merely knows
 * their email — so this step re-checks the caller supplies the matching
 * email AND phone on file before it will trigger a real Razorpay payment
 * link + SMS/email notification for that enrollment. A mismatch looks
 * identical to "not found" so this can't be used to probe which ids exist.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { enrollmentId, paymentType, email, phone, gateway = "razorpay" } = body;

  if (
    !Number.isInteger(enrollmentId) ||
    (paymentType !== "full" && paymentType !== "registration") ||
    typeof email !== "string" ||
    !isValidEmail(email) ||
    typeof phone !== "string" ||
    !isValidMobile(phone) ||
    !GATEWAYS.has(gateway)
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);

  const emailMatches =
    enrollment && enrollment.candidateEmail.trim().toLowerCase() === email.trim().toLowerCase();
  const phoneMatches =
    enrollment && enrollment.candidatePhone.replace(/\D/g, "") === phone.replace(/\D/g, "");

  if (!enrollment || !emailMatches || !phoneMatches) {
    return NextResponse.json({ error: "enrollment_not_found" }, { status: 404 });
  }

  if (paymentType === "registration" && enrollment.registrationFeeAmount === null) {
    return NextResponse.json({ error: "registration_fee_not_available" }, { status: 400 });
  }
  const paymentAmountPaise =
    paymentType === "registration" ? enrollment.registrationFeeAmount! : enrollment.totalFee;

  if (gateway === "easebuzz" ? !isEasebuzzConfigured() : !getRazorpayClient()) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const program = PROGRAMS.find((p) => p.slug === enrollment.programSlug);
  const description = `${program?.name ?? enrollment.programSlug} — ${paymentType === "registration" ? "Registration Fee" : "Course Fee"} — CareerZeta`;

  const [payment] = await db
    .insert(payments)
    .values({
      enrollmentId: enrollment.id,
      type: paymentType,
      amount: paymentAmountPaise,
      status: "created",
      gateway,
    })
    .returning();

  if (gateway === "easebuzz") {
    const txnid = generateEasebuzzTxnId(payment.id);
    try {
      const link = await createEasebuzzPaymentLink({
        txnid,
        amountPaise: paymentAmountPaise,
        productInfo: sanitizeEasebuzzProductInfo(description),
        firstName: enrollment.candidateName,
        email: enrollment.candidateEmail,
        phone: sanitizeEasebuzzPhone(enrollment.candidatePhone),
        successUrl: `${SITE_URL}/enroll/thank-you`,
        failureUrl: `${SITE_URL}/enroll/thank-you`,
        udf1: String(enrollment.id),
        udf2: String(payment.id),
      });

      await db
        .update(payments)
        .set({ easebuzzTxnId: link.txnid, paymentLinkUrl: link.paymentLinkUrl })
        .where(eq(payments.id, payment.id));

      return NextResponse.json({ paymentLinkUrl: link.paymentLinkUrl });
    } catch (err) {
      console.error("Easebuzz payment link creation failed:", err);
      return NextResponse.json({ error: "payment_link_failed" }, { status: 502 });
    }
  }

  const razorpay = getRazorpayClient()!;
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
      description,
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
