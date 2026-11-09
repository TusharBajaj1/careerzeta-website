import Link from "next/link";

import DriveBackfillButton from "@/components/admin/DriveBackfillButton";

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-16">
      <h1 className="font-display text-3xl font-bold">Admin</h1>
      <div className="mt-8 flex flex-col gap-4">
        <Link
          href="/admin/enrollments"
          className="rounded-lg border-2 border-line bg-white px-5 py-4 font-semibold transition hover:border-sky-400"
        >
          Enrollments
        </Link>
        <Link
          href="/admin/admissions"
          className="rounded-lg border-2 border-line bg-white px-5 py-4 font-semibold transition hover:border-sky-400"
        >
          Admissions
        </Link>
        <Link
          href="/admin/blog"
          className="rounded-lg border-2 border-line bg-white px-5 py-4 font-semibold transition hover:border-sky-400"
        >
          Blog
        </Link>
        <Link
          href="/admin/invoices"
          className="rounded-lg border-2 border-line bg-white px-5 py-4 font-semibold transition hover:border-sky-400"
        >
          Invoices
        </Link>
      </div>

      <h2 className="mt-12 font-display text-xl font-bold">Tools</h2>
      <div className="mt-4">
        <DriveBackfillButton />
      </div>
    </div>
  );
}
