import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-16">
      <h1 className="font-display text-3xl font-bold">Admin</h1>
      <div className="mt-8 flex flex-col gap-4">
        <Link
          href="/admin/coupons"
          className="rounded-lg border-2 border-line bg-white px-5 py-4 font-semibold transition hover:border-sky-400"
        >
          Coupons
        </Link>
        <Link
          href="/admin/enrollments"
          className="rounded-lg border-2 border-line bg-white px-5 py-4 font-semibold transition hover:border-sky-400"
        >
          Enrollments
        </Link>
      </div>
    </div>
  );
}
