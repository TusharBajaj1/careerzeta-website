import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import RegistrationsClient from "@/components/admin/RegistrationsClient";
import { db } from "@/lib/db";
import { enrollments } from "@/lib/db/schema";

/** Admin pages read live data on every request — never statically prerendered/cached. */
export const dynamic = "force-dynamic";

export default async function AdminRegistrationsPage() {
  const rows = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.status, "registration_paid"))
    .orderBy(desc(enrollments.createdAt));

  const initialRegistrations = rows.map((r) => ({
    id: r.id,
    candidateName: r.candidateName,
    candidateEmail: r.candidateEmail,
    candidatePhone: r.candidatePhone,
    programSlug: r.programSlug,
    totalFee: r.totalFee,
    amountPaid: r.amountPaid,
  }));

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <Link href="/admin" className="text-sm text-sky-700 hover:underline">
        ← Admin
      </Link>

      <RegistrationsClient initialRegistrations={initialRegistrations} />
    </div>
  );
}
