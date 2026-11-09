import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { sendInvoiceCancellationNotice } from "@/lib/invoiceEmail";

/**
 * Marks an invoice number void (no credit note — for an invoice that was
 * never recorded in the books or reported in a GST return, GSTR-1 has its
 * own "cancelled invoice" reporting for exactly this, a credit note is
 * only for reversing a supply that was already recorded) and emails the
 * payment's current enrollment asking them to disregard it. Independent
 * of /api/admin/payments/[id]/reassign — this is for cancelling an
 * invoice on its own, whether or not the payment is also being moved.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
  if (payment.invoiceCancelled) {
    return NextResponse.json({ error: "already_cancelled" }, { status: 400 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, payment.enrollmentId)).limit(1);

  await db
    .update(payments)
    .set({ invoiceCancelled: true, invoiceCancelledAt: new Date() })
    .where(eq(payments.id, paymentId));

  let noticeSent = false;
  if (enrollment) {
    noticeSent = await sendInvoiceCancellationNotice({
      candidateName: enrollment.candidateName,
      candidateEmail: enrollment.candidateEmail,
      invoiceNumber: payment.invoiceNumber,
    });
  }

  return NextResponse.json({ ok: true, noticeSent });
}
