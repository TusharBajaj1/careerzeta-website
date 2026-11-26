import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { getBooksClosedThrough, isInvoiceLocked } from "@/lib/accountingLock";
import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { generateInvoice } from "@/lib/invoiceEmail";

/**
 * Generates (or regenerates) an invoice and stores it — does NOT send it.
 * Separate manual step from send-invoice, so an invoice can be reviewed
 * (via download-invoice) before anyone emails it to the candidate.
 *
 * Reuses the existing invoice number as long as it isn't cancelled (see
 * generateInvoice), and resets invoiceSent back to false so a changed
 * document gets explicitly resent rather than assumed delivered. Blocked
 * only once the invoice is locked (booked in the accounts) — at that
 * point correcting it is a credit-note question, not a regenerate, even
 * if it was never sent.
 */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paymentId = Number(id);
  if (!Number.isInteger(paymentId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
  if (!payment) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (payment.status !== "paid") {
    return NextResponse.json({ error: "payment_not_paid" }, { status: 400 });
  }

  const booksClosedThrough = await getBooksClosedThrough();
  if (isInvoiceLocked(payment.paidAt ?? payment.createdAt, booksClosedThrough)) {
    return NextResponse.json({ error: "invoice_locked" }, { status: 400 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, payment.enrollmentId)).limit(1);
  if (!enrollment) {
    return NextResponse.json({ error: "enrollment_not_found" }, { status: 404 });
  }

  const { invoiceNumber, pdfUrl } = await generateInvoice(payment, enrollment);
  if (!invoiceNumber) {
    return NextResponse.json({ error: "generation_failed" }, { status: 502 });
  }

  await db
    .update(payments)
    .set({
      invoiceNumber,
      invoicePdfUrl: pdfUrl,
      invoiceCancelled: false,
      invoiceCancelledAt: null,
      invoiceSent: false,
    })
    .where(eq(payments.id, paymentId));

  return NextResponse.json({ ok: true, invoiceNumber, pdfUrl });
}
