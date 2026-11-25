import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { getBooksClosedThrough, isInvoiceLocked } from "@/lib/accountingLock";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";

/**
 * Marks an invoice number void (no credit note — for an invoice that was
 * never recorded in the books or reported in a GST return, GSTR-1 has its
 * own "cancelled invoice" reporting for exactly this, a credit note is
 * only for reversing a supply that was already recorded). Independent of
 * /api/admin/payments/[id]/reassign — this is for cancelling an invoice
 * on its own, whether or not the payment is also being moved.
 *
 * Deliberately does NOT email the candidate — all candidate
 * communication is manual-only for now (team request). If the candidate
 * needs to be told, do that separately.
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
  if (payment.invoiceCancelled) {
    return NextResponse.json({ error: "already_cancelled" }, { status: 400 });
  }

  const booksClosedThrough = await getBooksClosedThrough();
  if (isInvoiceLocked(payment.paidAt ?? payment.createdAt, booksClosedThrough)) {
    return NextResponse.json({ error: "invoice_locked" }, { status: 400 });
  }

  await db
    .update(payments)
    .set({ invoiceCancelled: true, invoiceCancelledAt: new Date() })
    .where(eq(payments.id, paymentId));

  return NextResponse.json({ ok: true });
}
