import { NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { refreshInvoiceDriveCopy } from "@/lib/invoiceEmail";

/**
 * Re-renders this invoice's PDF from current data and pushes it to Drive
 * (and blob storage) — no email, no change to invoiceSent/invoiceCancelled
 * or the invoice number itself. For pushing a template/content fix into
 * an already-issued invoice's Drive copy. See refreshInvoiceDriveCopy for
 * why this is a deliberate one-at-a-time admin action, not a bulk job.
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
  if (!payment.invoiceNumber) {
    return NextResponse.json({ error: "no_invoice" }, { status: 400 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, payment.enrollmentId)).limit(1);
  if (!enrollment) {
    return NextResponse.json({ error: "enrollment_not_found" }, { status: 404 });
  }

  // Running total as of (and including) this payment, in the order
  // payments actually cleared — what "total paid to date" genuinely was
  // when this invoice was issued, not whatever it's grown to since.
  const paidPayments = await db
    .select({ id: payments.id, amount: payments.amount })
    .from(payments)
    .where(and(eq(payments.enrollmentId, payment.enrollmentId), eq(payments.status, "paid")))
    .orderBy(asc(payments.paidAt), asc(payments.id));

  let amountPaidTotalPaise = enrollment.amountPaid;
  if (paidPayments.some((p) => p.id === payment.id)) {
    amountPaidTotalPaise = 0;
    for (const p of paidPayments) {
      amountPaidTotalPaise += p.amount;
      if (p.id === payment.id) break;
    }
  }

  const result = await refreshInvoiceDriveCopy(payment, enrollment, amountPaidTotalPaise);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "refresh_failed" }, { status: 502 });
  }

  if (result.pdfUrl) {
    await db.update(payments).set({ invoicePdfUrl: result.pdfUrl }).where(eq(payments.id, paymentId));
  }

  return NextResponse.json({ ok: true, pdfUrl: result.pdfUrl });
}
