import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { generateInvoice } from "@/lib/invoiceEmail";

/**
 * Generates (or regenerates) an invoice and stores it — does NOT send it.
 * Separate manual step from send-invoice, so an invoice can be reviewed
 * (via download-invoice) before anyone emails it to the candidate.
 *
 * Blocked once the current invoice has already been sent: at that point
 * it's a real issued document, and correcting it is a cancel-then-generate-
 * fresh question (see /api/admin/payments/[id]/cancel-invoice), not
 * something this silently overwrites in place.
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
  if (payment.invoiceSent && !payment.invoiceCancelled) {
    return NextResponse.json({ error: "already_sent" }, { status: 400 });
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
