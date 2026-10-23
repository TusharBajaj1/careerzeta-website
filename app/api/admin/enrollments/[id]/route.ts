import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { isValidEmail, isValidGstin, isValidMobile } from "@/lib/forms";
import { INDIAN_STATE_NAMES } from "@/lib/indianStates";
import { rupeesToPaise } from "@/lib/money";
import { PROGRAMS } from "@/lib/content";

const PROGRAM_SLUGS = new Set(PROGRAMS.map((p) => p.slug));
const STATE_SET = new Set(INDIAN_STATE_NAMES);

/** The status implied by payment progress alone — what "undo refund request" reverts to. */
function paymentDerivedStatus(amountPaid: number, totalFee: number): "pending" | "registration_paid" | "fully_paid" {
  if (amountPaid >= totalFee) return "fully_paid";
  if (amountPaid > 0) return "registration_paid";
  return "pending";
}

/**
 * Two unrelated kinds of update, told apart by payload shape:
 *  - { status: "cancelled" | "refund_requested" } or { undoRefundRequest: true }
 *    — status-only transitions, always allowed.
 *  - Candidate/fee details (name, email, phone, state, address, gstin,
 *    programSlug, totalFee, registrationFeeAmount, salesExecutive) — only
 *    allowed while amountPaid is 0. Once a payment (or an invoice built from
 *    these details) exists, editing them would make the invoice on file
 *    inconsistent with the record, so this is enforced server-side, not
 *    just hidden in the UI.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const enrollmentId = Number(id);
  if (!Number.isInteger(enrollmentId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const [existing] = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (body.status === "cancelled" || body.status === "refund_requested") {
    const [updated] = await db
      .update(enrollments)
      .set({ status: body.status })
      .where(eq(enrollments.id, enrollmentId))
      .returning();
    return NextResponse.json({ enrollment: updated });
  }

  if (body.undoRefundRequest === true) {
    const [updated] = await db
      .update(enrollments)
      .set({ status: paymentDerivedStatus(existing.amountPaid, existing.totalFee) })
      .where(eq(enrollments.id, enrollmentId))
      .returning();
    return NextResponse.json({ enrollment: updated });
  }

  // Otherwise: an edit to candidate/fee details.
  if (existing.amountPaid > 0) {
    return NextResponse.json({ error: "enrollment_already_paid" }, { status: 400 });
  }

  const { name, email, phone, state, address, gstin, programSlug, totalFee, salesExecutive, registrationFeeAmount } =
    body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !isValidEmail(email) ||
    typeof phone !== "string" ||
    !isValidMobile(phone) ||
    typeof state !== "string" ||
    !STATE_SET.has(state) ||
    typeof programSlug !== "string" ||
    !PROGRAM_SLUGS.has(programSlug) ||
    typeof totalFee !== "number" ||
    totalFee <= 0 ||
    (registrationFeeAmount !== undefined &&
      registrationFeeAmount !== null &&
      (typeof registrationFeeAmount !== "number" ||
        registrationFeeAmount <= 0 ||
        registrationFeeAmount >= totalFee)) ||
    (gstin !== undefined && gstin !== null && gstin !== "" && (typeof gstin !== "string" || !isValidGstin(gstin)))
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const [updated] = await db
    .update(enrollments)
    .set({
      candidateName: name.trim(),
      candidateEmail: email.trim().toLowerCase(),
      candidatePhone: phone.trim(),
      candidateState: state,
      candidateAddress: typeof address === "string" && address.trim() ? address.trim() : null,
      candidateGstin: typeof gstin === "string" && gstin.trim() ? gstin.trim().toUpperCase() : null,
      programSlug,
      salesExecutive: typeof salesExecutive === "string" && salesExecutive.trim() ? salesExecutive.trim() : null,
      totalFee: rupeesToPaise(totalFee),
      registrationFeeAmount:
        typeof registrationFeeAmount === "number" ? rupeesToPaise(registrationFeeAmount) : null,
    })
    .where(eq(enrollments.id, enrollmentId))
    .returning();

  return NextResponse.json({ enrollment: updated });
}

/** Only removes an enrollment that's never actually been paid — anything with real payment history keeps using Cancel instead. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const enrollmentId = Number(id);
  if (!Number.isInteger(enrollmentId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);
  if (!enrollment) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (enrollment.amountPaid > 0) {
    return NextResponse.json({ error: "enrollment_already_paid" }, { status: 400 });
  }

  // Any payments on an unpaid enrollment are just stale "created"/unpaid link attempts.
  await db.delete(payments).where(eq(payments.enrollmentId, enrollmentId));
  await db.delete(enrollments).where(eq(enrollments.id, enrollmentId));

  return NextResponse.json({ ok: true });
}
