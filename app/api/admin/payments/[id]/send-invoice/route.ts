import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { resendExistingInvoice, sendPaymentInvoice } from "@/lib/invoiceEmail";

/**
 * One button for every "send the candidate their invoice" case: a payment
 * that never got one, a candidate asking for another copy, or a payment
 * whose only invoice was cancelled. Re-sends the existing invoice
 * unchanged when there is a valid one on file; issues a fresh invoice
 * number (and persists its PDF) when there isn't — covers both without
 * the admin needing to know which case they're in.
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

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, payment.enrollmentId)).limit(1);
  if (!enrollment) {
    return NextResponse.json({ error: "enrollment_not_found" }, { status: 404 });
  }

  const needsFreshInvoice = !payment.invoiceNumber || payment.invoiceCancelled;

  if (needsFreshInvoice) {
    const { invoiceNumber, sent, pdfUrl } = await sendPaymentInvoice(payment, enrollment);
    await db
      .update(payments)
      .set({
        invoiceNumber,
        invoiceSent: sent,
        invoicePdfUrl: pdfUrl,
        invoiceCancelled: false,
        invoiceCancelledAt: null,
      })
      .where(eq(payments.id, paymentId));
    return NextResponse.json({ ok: true, sent, invoiceNumber, fresh: true });
  }

  const sent = await resendExistingInvoice(payment, enrollment);
  return NextResponse.json({ ok: true, sent, invoiceNumber: payment.invoiceNumber, fresh: false });
}
