import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { rupeesToPaise } from "@/lib/money";
import { PROGRAMS } from "@/lib/content";
import { confirmPaymentPaid } from "@/lib/paymentConfirmation";
import { generatePaymentLink, isGatewayConfigured } from "@/lib/createPaymentLink";

const PAYMENT_TYPES = new Set(["registration", "balance", "full"]);
const GATEWAYS = new Set(["razorpay", "easebuzz", "manual"]);

/**
 * Creates a payment for an existing enrollment. For "razorpay"/"easebuzz"
 * this triggers a real payment link — the registration fee when the
 * sales team first collects a partial amount, or the remaining balance
 * once they're ready to collect it. For "manual" there's no link at
 * all: this covers money already collected directly (e.g. UPI straight
 * into the account), so the payment is created and immediately marked
 * paid in one step via confirmPaymentPaid — same downstream effects
 * (enrollment totals, admission number) as a real gateway webhook,
 * just without ever generating a link or calling an external API.
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

  const { amount, type, gateway = "razorpay" } = body;
  if (
    typeof amount !== "number" ||
    amount <= 0 ||
    typeof type !== "string" ||
    !PAYMENT_TYPES.has(type) ||
    !GATEWAYS.has(gateway)
  ) {
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

  if (gateway !== "manual" && !isGatewayConfigured(gateway)) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const [payment] = await db
    .insert(payments)
    .values({
      enrollmentId: enrollment.id,
      type: type as "registration" | "balance" | "full",
      amount: amountPaise,
      status: "created",
      gateway,
    })
    .returning();

  if (gateway === "manual") {
    const result = await confirmPaymentPaid({ paymentId: payment.id, capturedAmountPaise: amountPaise });
    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }
    const [paidPayment] = await db.select().from(payments).where(eq(payments.id, payment.id)).limit(1);
    return NextResponse.json({ payment: paidPayment });
  }

  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;
  const description = `${programName} — ${type === "registration" ? "Registration Fee" : type === "balance" ? "Balance Payment" : "Course Fee"} — CareerZeta`;

  try {
    const updatedPayment = await generatePaymentLink({ enrollment, payment, gateway, description });
    return NextResponse.json({ payment: updatedPayment });
  } catch (err) {
    console.error(`${gateway} payment link creation failed:`, err);
    return NextResponse.json({ error: "payment_link_failed" }, { status: 502 });
  }
}
