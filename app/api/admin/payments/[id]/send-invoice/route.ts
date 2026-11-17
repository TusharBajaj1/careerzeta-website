import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { resendExistingInvoice } from "@/lib/invoiceEmail";

/**
 * Emails the already-generated invoice on file for this payment — never
 * generates one itself. Use /api/admin/payments/[id]/generate-invoice
 * first if there isn't a usable one yet; this route only sends what's
 * already there, so an invoice can always be reviewed (download-invoice)
 * before anyone clicks this.
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
  if (!payment.invoiceNumber || payment.invoiceCancelled) {
    return NextResponse.json({ error: "no_invoice_generated" }, { status: 400 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, payment.enrollmentId)).limit(1);
  if (!enrollment) {
    return NextResponse.json({ error: "enrollment_not_found" }, { status: 404 });
  }

  const sent = await resendExistingInvoice(payment, enrollment);
  if (sent) {
    await db.update(payments).set({ invoiceSent: true }).where(eq(payments.id, paymentId));
  }

  return NextResponse.json({ ok: true, sent, invoiceNumber: payment.invoiceNumber });
}
