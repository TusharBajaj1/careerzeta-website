import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { creditNotes, enrollments, payments } from "@/lib/db/schema";
import { sendCreditNote } from "@/lib/creditNoteEmail";

/** Manually emails the already-generated credit note to the candidate — never automatic, same as every other candidate-facing document here. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paymentId = Number(id);
  if (!Number.isInteger(paymentId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
  if (!payment || !payment.invoiceNumber) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const [creditNote] = await db.select().from(creditNotes).where(eq(creditNotes.paymentId, paymentId)).limit(1);
  if (!creditNote || !creditNote.pdfUrl) {
    return NextResponse.json({ error: "credit_note_not_found" }, { status: 404 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, payment.enrollmentId)).limit(1);
  if (!enrollment) {
    return NextResponse.json({ error: "enrollment_not_found" }, { status: 404 });
  }

  const sent = await sendCreditNote({
    creditNoteNumber: creditNote.creditNoteNumber,
    pdfUrl: creditNote.pdfUrl,
    candidateName: enrollment.candidateName,
    candidateEmail: enrollment.candidateEmail,
    originalInvoiceNumber: payment.invoiceNumber,
    amountPaise: creditNote.amount,
  });

  if (sent) {
    await db.update(creditNotes).set({ sent: true }).where(eq(creditNotes.id, creditNote.id));
  }

  return NextResponse.json({ ok: true, sent });
}
