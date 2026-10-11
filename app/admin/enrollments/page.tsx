import Link from "next/link";
import { asc, desc } from "drizzle-orm";

import DemoRequestsClient from "@/components/admin/DemoRequestsClient";
import EnrollmentsClient from "@/components/admin/EnrollmentsClient";
import { db } from "@/lib/db";
import { demoRequests, enrollments, payments } from "@/lib/db/schema";

/** Admin pages read live data on every request — never statically prerendered/cached. */
export const dynamic = "force-dynamic";

export default async function AdminEnrollmentsPage() {
  const enrollmentRows = await db.select().from(enrollments).orderBy(desc(enrollments.createdAt));
  const paymentRows = await db.select().from(payments).orderBy(asc(payments.createdAt));
  const demoRequestRows = await db.select().from(demoRequests).orderBy(desc(demoRequests.createdAt));

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

  const initialDemoRequests = demoRequestRows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <Link href="/admin" className="text-sm text-sky-700 hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Enrollments</h1>

      <EnrollmentsClient initialEnrollments={initialEnrollments} />

      <h2 className="mt-16 font-display text-2xl font-bold">Demo Requests</h2>
      <p className="mt-1 text-sm opacity-60">
        Candidates who weren&apos;t ready to pay and asked for a demo instead.
      </p>
      <DemoRequestsClient initialRequests={initialDemoRequests} />
    </div>
  );
}
