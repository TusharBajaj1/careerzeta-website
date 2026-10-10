import Link from "next/link";
import { desc } from "drizzle-orm";

import CouponsClient from "@/components/admin/CouponsClient";
import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema";

/** Admin pages read live data on every request — never statically prerendered/cached. */
export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const rows = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  const initialCoupons = rows.map((c) => ({
    ...c,
    expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16">
      <Link href="/admin" className="text-sm text-sky-700 hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Coupons</h1>

      <CouponsClient initialCoupons={initialCoupons} />
    </div>
  );
}
