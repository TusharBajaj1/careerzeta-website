import Link from "next/link";
import { desc } from "drizzle-orm";

import DemoRequestsClient from "@/components/admin/DemoRequestsClient";
import { db } from "@/lib/db";
import { demoRequests } from "@/lib/db/schema";

/** Admin pages read live data on every request — never statically prerendered/cached. */
export const dynamic = "force-dynamic";

export default async function AdminDemoRequestsPage() {
  const rows = await db.select().from(demoRequests).orderBy(desc(demoRequests.createdAt));
  const initialRequests = rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16">
      <Link href="/admin" className="text-sm text-sky-700 hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Demo Requests</h1>

      <DemoRequestsClient initialRequests={initialRequests} />
    </div>
  );
}
