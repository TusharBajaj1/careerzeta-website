import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { isValidEmail, isValidGstin, isValidMobile } from "@/lib/forms";
import { INDIAN_STATE_NAMES } from "@/lib/indianStates";
import { rupeesToPaise } from "@/lib/money";
import { paymentDerivedStatus, recomputeEnrollmentTotals } from "@/lib/paymentConfirmation";
import { PROGRAMS } from "@/lib/content";

const PROGRAM_SLUGS = new Set(PROGRAMS.map((p) => p.slug));
const STATE_SET = new Set(INDIAN_STATE_NAMES);

/**
 * Several unrelated kinds of update, told apart by payload shape:
 *  - { status: "cancelled" | "refund_requested" } or { undoRefundRequest: true }
 *    — status-only transitions, always allowed.
 *  - { totalFee } alone — settable at any time, including after payment
 *    (a negotiated discount, a correction, a scholarship applied later).
 *    Unlike the full candidate/fee-details edit below, this doesn't touch
 *    anything an already-sent invoice reflects (an invoice is built from
 *    what was actually paid, not from totalFee), so it's safe to allow
 *    post-payment. Recomputes amountPaid/status afterward since lowering
 *    the fee can bring what's already been paid up to (or past) the new
 *    total — e.g. a discount that fully covers the remaining balance
 *    should flip the enrollment to fully_paid right away.
 *  - Candidate/fee details (name, email, phone, state, address, gstin,
 *    programSlug, registrationFeeAmount, salesExecutive — totalFee too,
 *    via this same full-form path) — allowed at any time, including after
 *    payment, for correcting a data-entry mistake or a genuine change
 *    (address, phone, etc). Already-issued invoices/letters are built from
 *    a snapshot at generation time and don't retroactively update — the
 *    admin UI warns about this and each document has its own Regenerate/
 *    Refresh-in-Drive action if it needs to reflect the correction. Can't
 *    drop totalFee below amountPaid (would mean a negative balance); does
 *    recompute amountPaid/status afterward since changing totalFee can
 *    change which side of fully_paid the enrollment falls on.
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

  // Batch/cohort info — unlike the candidate/fee details below, this is set
  // (and often changed) after a payment exists, since the batch is usually
  // assigned around the time of admission rather than at signup.
  if (typeof body.batchDetails === "string" && Object.keys(body).length === 1) {
    const [updated] = await db
      .update(enrollments)
      .set({ batchDetails: body.batchDetails.trim() || null })
      .where(eq(enrollments.id, enrollmentId))
      .returning();
    return NextResponse.json({ enrollment: updated });
  }

  // The admission letter's editable message — same reasoning as batch
  // details: always settable, since the wording is meant to be tweaked
  // freely rather than fixed in code. An empty string clears the override
  // and reverts to the default template.
  if (typeof body.admissionLetterBody === "string" && Object.keys(body).length === 1) {
    const [updated] = await db
      .update(enrollments)
      .set({ admissionLetterBody: body.admissionLetterBody.trim() || null })
      .where(eq(enrollments.id, enrollmentId))
      .returning();
    return NextResponse.json({ enrollment: updated });
  }

  // Total fee adjustment on its own — allowed post-payment, unlike the
  // full candidate/fee-details form below. Can't drop below what's
  // already been paid (that would mean a negative balance), and clears
  // registrationFeeAmount if it's no longer below the new total.
  if (typeof body.totalFee === "number" && Object.keys(body).length === 1) {
    if (body.totalFee <= 0) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }
    const newTotalFeePaise = rupeesToPaise(body.totalFee);
    if (newTotalFeePaise < existing.amountPaid) {
      return NextResponse.json({ error: "total_fee_below_amount_paid" }, { status: 400 });
    }

    await db
      .update(enrollments)
      .set({
        totalFee: newTotalFeePaise,
        registrationFeeAmount:
          existing.registrationFeeAmount !== null && existing.registrationFeeAmount >= newTotalFeePaise
            ? null
            : existing.registrationFeeAmount,
      })
      .where(eq(enrollments.id, enrollmentId));

    await recomputeEnrollmentTotals(enrollmentId);

    const [updated] = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);
    return NextResponse.json({ enrollment: updated });
  }

  // Otherwise: an edit to candidate/fee details. Allowed post-payment too —
  // the admin UI warns that already-issued invoices/letters were built from
  // whatever the details were at the time and won't retroactively update;
  // each document's own Regenerate/Refresh-in-Drive action handles that.
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

  const newTotalFeePaise = rupeesToPaise(totalFee);
  if (newTotalFeePaise < existing.amountPaid) {
    return NextResponse.json({ error: "total_fee_below_amount_paid" }, { status: 400 });
  }

  await db
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
      totalFee: newTotalFeePaise,
      registrationFeeAmount:
        typeof registrationFeeAmount === "number" ? rupeesToPaise(registrationFeeAmount) : null,
    })
    .where(eq(enrollments.id, enrollmentId));

  // totalFee can change here too, same as the dedicated Total Fee control —
  // recompute so amountPaid/status stay derived correctly (e.g. lowering it
  // to meet what's already been paid should flip the enrollment to fully_paid).
  await recomputeEnrollmentTotals(enrollmentId);

  const [updated] = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);
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
