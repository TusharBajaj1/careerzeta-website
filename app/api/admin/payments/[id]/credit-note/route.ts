import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { creditNotes, enrollments, payments } from "@/lib/db/schema";
import { generateAndStoreCreditNote } from "@/lib/creditNoteEmail";
import { nextCreditNoteNumber } from "@/lib/creditNoteNumber";
import { PROGRAMS } from "@/lib/content";

/**
 * Issues a credit note against this payment's invoice, for its full
 * amount — the mechanism for correcting a locked (booked) invoice instead
 * of editing it in place, and also the documentation step for a plain
 * cancellation: process is cancel the invoice, then issue a credit note
 * against it (no auto-generation — this stays a separate, manual action).
 * One credit note per invoice: blocked only if one already exists.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paymentId = Number(id);
  if (!Number.isInteger(paymentId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
  if (!reason) {
    return NextResponse.json({ error: "reason_required" }, { status: 400 });
  }

  const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
  if (!payment) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (!payment.invoiceNumber) {
    return NextResponse.json({ error: "no_invoice" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: creditNotes.id })
    .from(creditNotes)
    .where(eq(creditNotes.paymentId, paymentId))
    .limit(1);
  if (existing) {
    return NextResponse.json({ error: "credit_note_already_exists" }, { status: 400 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, payment.enrollmentId)).limit(1);
  if (!enrollment) {
    return NextResponse.json({ error: "enrollment_not_found" }, { status: 404 });
  }

  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;
  const creditNoteNumber = await nextCreditNoteNumber();

  let pdfUrl: string | null;
  try {
    const result = await generateAndStoreCreditNote({
      creditNoteNumber,
      issuedAt: new Date(),
      originalInvoiceNumber: payment.invoiceNumber,
      originalInvoiceDate: payment.paidAt ?? payment.createdAt,
      reason,
      candidateName: enrollment.candidateName,
      candidateEmail: enrollment.candidateEmail,
      candidatePhone: enrollment.candidatePhone,
      candidateState: enrollment.candidateState,
      candidateAddress: enrollment.candidateAddress,
      candidateGstin: enrollment.candidateGstin,
      programName,
      amountPaise: payment.amount,
    });
    pdfUrl = result.pdfUrl;
  } catch (err) {
    console.error(`Credit note generation failed for payment ${paymentId}:`, err);
    return NextResponse.json({ error: "generation_failed" }, { status: 502 });
  }

  const [created] = await db
    .insert(creditNotes)
    .values({
      paymentId,
      creditNoteNumber,
      amount: payment.amount,
      reason,
      pdfUrl,
    })
    .returning();

  return NextResponse.json({ ok: true, creditNote: created });
}
