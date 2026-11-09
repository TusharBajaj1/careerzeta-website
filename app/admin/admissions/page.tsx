import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import AdmissionsClient from "@/components/admin/AdmissionsClient";
import { db } from "@/lib/db";
import { enrollments } from "@/lib/db/schema";

/** Admin pages read live data on every request — never statically prerendered/cached. */
export const dynamic = "force-dynamic";

export default async function AdminAdmissionsPage() {
  const rows = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.status, "fully_paid"))
    .orderBy(desc(enrollments.createdAt));

  const initialAdmissions = rows.map((r) => ({
    id: r.id,
    candidateName: r.candidateName,
    candidateEmail: r.candidateEmail,
    candidatePhone: r.candidatePhone,
    programSlug: r.programSlug,
    totalFee: r.totalFee,
    batchDetails: r.batchDetails,
    admissionLetterBody: r.admissionLetterBody,
    admissionLetterSent: r.admissionLetterSent,
    admissionLetterSentAt: r.admissionLetterSentAt ? r.admissionLetterSentAt.toISOString() : null,
  }));

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <Link href="/admin" className="text-sm text-sky-700 hover:underline">
        ← Admin
      </Link>

      <AdmissionsClient initialAdmissions={initialAdmissions} />
    </div>
  );
}
