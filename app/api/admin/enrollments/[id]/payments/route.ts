import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { rupeesToPaise } from "@/lib/money";
import { getRazorpayClient } from "@/lib/razorpay";
import { PROGRAMS } from "@/lib/content";

const SITE_URL = "https://www.careerzeta.com";
const PAYMENT_TYPES = new Set(["registration", "balance", "full"]);

/**
 * Manually triggers a Razorpay payment link for an existing enrollment —
 * the registration fee when the sales team first collects a partial
 * amount, or the remaining balance once they're ready to collect it.
 * Amount and type are chosen by the admin each time (case-by-case), not
 * derived automatically.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const enrollmentId = Number(id);
  if (!Number.isInteger(enrollmentId)) {
    return NextResponse.json({ error: "invalid_enrollment_id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { amount, type } = body;
  if (typeof amount !== "number" || amount <= 0 || typeof type !== "string" || !PAYMENT_TYPES.has(type)) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);
  if (!enrollment) {
    return NextResponse.json({ error: "enrollment_not_found" }, { status: 404 });
  }

  const amountPaise = rupeesToPaise(amount);
  const remaining = enrollment.totalFee - enrollment.amountPaid;
  if (amountPaise > remaining) {
    return NextResponse.json({ error: "amount_exceeds_balance", remaining }, { status: 400 });
  }

  const razorpay = getRazorpayClient();
  if (!razorpay) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const [payment] = await db
    .insert(payments)
    .values({
      enrollmentId: enrollment.id,
      type: type as "registration" | "balance" | "full",
      amount: amountPaise,
      status: "created",
    })
    .returning();

  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;

  try {
    const link = await razorpay.paymentLink.create({
      amount: amountPaise,
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
      description: `${programName} — ${type === "registration" ? "Registration Fee" : type === "balance" ? "Balance Payment" : "Course Fee"} — CareerZeta`,
      callback_url: `${SITE_URL}/enroll/thank-you`,
      callback_method: "get",
    });

    const [updatedPayment] = await db
      .update(payments)
      .set({ razorpayPaymentLinkId: link.id, paymentLinkUrl: link.short_url })
      .where(eq(payments.id, payment.id))
      .returning();

    return NextResponse.json({ payment: updatedPayment });
  } catch (err) {
    console.error("Razorpay payment link creation failed:", err);
    return NextResponse.json({ error: "payment_link_failed" }, { status: 502 });
  }
}
