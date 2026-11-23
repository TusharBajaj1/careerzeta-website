import Link from "next/link";
import { and, desc, eq, inArray } from "drizzle-orm";

import RegistrationsClient from "@/components/admin/RegistrationsClient";
import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";

/** Admin pages read live data on every request — never statically prerendered/cached. */
export const dynamic = "force-dynamic";

export default async function AdminRegistrationsPage() {
  // Anyone who actually went through the registration-fee path — not just
  // anyone registration_paid/fully_paid, since a candidate can also reach
  // fully_paid by paying the full fee in one go, with no registration
  // letter ever issued for them.
  const registrationPayments = await db
    .selectDistinct({ enrollmentId: payments.enrollmentId })
    .from(payments)
    .where(and(eq(payments.type, "registration"), eq(payments.status, "paid")));
  const registeredEnrollmentIds = registrationPayments.map((p) => p.enrollmentId);

  const rows = registeredEnrollmentIds.length
    ? await db
        .select()
        .from(enrollments)
        .where(
          and(
            inArray(enrollments.id, registeredEnrollmentIds),
            inArray(enrollments.status, ["registration_paid", "fully_paid"]),
          ),
        )
        .orderBy(desc(enrollments.createdAt))
    : [];

  const initialRegistrations = rows.map((r) => ({
    id: r.id,
    candidateName: r.candidateName,
    candidateEmail: r.candidateEmail,
    candidatePhone: r.candidatePhone,
    programSlug: r.programSlug,
    totalFee: r.totalFee,
    amountPaid: r.amountPaid,
    status: r.status as "registration_paid" | "fully_paid",
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
