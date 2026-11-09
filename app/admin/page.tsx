import Link from "next/link";
import { BadgePercent, FileText, GraduationCap, Newspaper, Users, type LucideIcon } from "lucide-react";

import DriveBackfillButton from "@/components/admin/DriveBackfillButton";

const CATEGORY_ACCENT: Record<string, string> = {
  Candidates: "bg-sky-100 text-sky-700",
  Finance: "bg-emerald-100 text-emerald-700",
  Content: "bg-violet-100 text-violet-700",
};

const SECTIONS: { title: string; items: { href: string; label: string; description: string; icon: LucideIcon }[] }[] = [
  {
    title: "Candidates",
    items: [
      { href: "/admin/enrollments", label: "Enrollments", description: "Leads, payments, and the enrollment pipeline", icon: Users },
      {
        href: "/admin/admissions",
        label: "Admissions",
        description: "Fully paid candidates, batch details, admission letters",
        icon: GraduationCap,
      },
      { href: "/admin/coupons", label: "Coupons", description: "Discount codes and sales-exec offers", icon: BadgePercent },
    ],
  },
  {
    title: "Finance",
    items: [
      { href: "/admin/invoices", label: "Invoices", description: "Every invoice issued, across all enrollments", icon: FileText },
    ],
  },
  {
    title: "Content",
    items: [{ href: "/admin/blog", label: "Blog", description: "Posts, series, scheduling", icon: Newspaper }],
  },
];

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-[960px] px-6 py-16">
      <h1 className="font-display text-3xl font-bold">Admin</h1>
      <p className="mt-1 text-sm opacity-60">Everything for running CareerZeta day to day.</p>

      <div className="mt-10 flex flex-col gap-10">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-bold tracking-wide uppercase opacity-60">{section.title}</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-xl border-2 border-line bg-white p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-md"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${CATEGORY_ACCENT[section.title] ?? "bg-sky-100 text-sky-700"}`}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="mt-3 font-semibold group-hover:text-sky-700">{item.label}</div>
                    <div className="mt-0.5 text-xs opacity-60">{item.description}</div>
                  </Link>
                );
              })}
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
