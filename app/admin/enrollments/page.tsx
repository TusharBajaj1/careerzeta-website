import Link from "next/link";
import { asc, desc } from "drizzle-orm";

import EnrollmentsClient from "@/components/admin/EnrollmentsClient";
import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";

/** Admin pages read live data on every request — never statically prerendered/cached. */
export const dynamic = "force-dynamic";

export default async function AdminEnrollmentsPage() {
  const enrollmentRows = await db.select().from(enrollments).orderBy(desc(enrollments.createdAt));
  const paymentRows = await db.select().from(payments).orderBy(asc(payments.createdAt));

  const initialEnrollments = enrollmentRows.map((enrollment) => ({
    ...enrollment,
    createdAt: enrollment.createdAt.toISOString(),
    payments: paymentRows
      .filter((p) => p.enrollmentId === enrollment.id)
      .map((p) => ({
        ...p,
        paidAt: p.paidAt ? p.paidAt.toISOString() : null,
        createdAt: p.createdAt.toISOString(),
      })),
  }));

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <Link href="/admin" className="text-sm text-sky-700 hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Enrollments</h1>

      <EnrollmentsClient initialEnrollments={initialEnrollments} />
    </div>
  );
}
