import { NextResponse } from "next/server";
import { desc, eq, isNotNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";

/** Every payment that actually got an invoice number, newest first, with its (current) enrollment's candidate details. */
export async function GET() {
  const rows = await db
    .select({
      id: payments.id,
      enrollmentId: payments.enrollmentId,
      type: payments.type,
      amount: payments.amount,
      invoiceNumber: payments.invoiceNumber,
      invoiceCancelled: payments.invoiceCancelled,
      invoiceCancelledAt: payments.invoiceCancelledAt,
      paidAt: payments.paidAt,
      candidateName: enrollments.candidateName,
      candidateEmail: enrollments.candidateEmail,
      programSlug: enrollments.programSlug,
    })
    .from(payments)
    .innerJoin(enrollments, eq(payments.enrollmentId, enrollments.id))
    .where(isNotNull(payments.invoiceNumber))
    .orderBy(desc(payments.id));

  return NextResponse.json({ invoices: rows });
}
