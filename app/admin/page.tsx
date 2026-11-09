import Link from "next/link";

import DriveBackfillButton from "@/components/admin/DriveBackfillButton";

const SECTIONS: { title: string; items: { href: string; label: string; description: string }[] }[] = [
  {
    title: "Candidates",
    items: [
      { href: "/admin/enrollments", label: "Enrollments", description: "Leads, payments, and the enrollment pipeline" },
      { href: "/admin/admissions", label: "Admissions", description: "Fully paid candidates, batch details, admission letters" },
      { href: "/admin/coupons", label: "Coupons", description: "Discount codes and sales-exec offers" },
    ],
  },
  {
    title: "Finance",
    items: [{ href: "/admin/invoices", label: "Invoices", description: "Every invoice issued, across all enrollments" }],
  },
  {
    title: "Content",
    items: [{ href: "/admin/blog", label: "Blog", description: "Posts, series, scheduling" }],
  },
];

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-16">
      <h1 className="font-display text-3xl font-bold">Admin</h1>

      <div className="mt-10 flex flex-col gap-10">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-bold tracking-wide uppercase opacity-60">{section.title}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border-2 border-line bg-white px-5 py-4 transition hover:border-sky-400"
                >
                  <div className="font-semibold">{item.label}</div>
                  <div className="mt-0.5 text-xs opacity-60">{item.description}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-line pt-4">
        <DriveBackfillButton />
      </div>
    </div>
  );
}
