import Link from "next/link";
import { desc, eq, isNotNull } from "drizzle-orm";

import InvoicesClient from "@/components/admin/InvoicesClient";
import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";

/** Admin pages read live data on every request — never statically prerendered/cached. */
export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
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

  const initialInvoices = rows.map((row) => ({
    ...row,
    invoiceNumber: row.invoiceNumber!,
    invoiceCancelledAt: row.invoiceCancelledAt ? row.invoiceCancelledAt.toISOString() : null,
    paidAt: row.paidAt ? row.paidAt.toISOString() : null,
  }));

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <Link href="/admin" className="text-sm text-sky-700 hover:underline">
        ← Admin
      </Link>

      <InvoicesClient initialInvoices={initialInvoices} />
    </div>
  );
}
