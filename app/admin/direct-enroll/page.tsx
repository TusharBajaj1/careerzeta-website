import Link from "next/link";

import DirectEnrollAdminClient from "@/components/admin/DirectEnrollAdminClient";

export const dynamic = "force-dynamic";

export default function AdminDirectEnrollPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-16">
      <Link href="/admin" className="text-sm text-sky-700 hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Direct Enroll</h1>
      <p className="mt-2 text-sm opacity-60">
        Set one exact amount per candidate — no coupon code, no registration-fee split. The
        candidate pays it at{" "}
        <Link href="/enroll-direct" className="text-sky-700 hover:underline">
          /enroll-direct
        </Link>{" "}
        by entering the same email and phone number. Every enrollment created here also shows up
        on the main{" "}
        <Link href="/admin/enrollments" className="text-sky-700 hover:underline">
          Enrollments
        </Link>{" "}
        page for payment tracking and invoices.
      </p>

      <DirectEnrollAdminClient />
    </div>
  );
}
