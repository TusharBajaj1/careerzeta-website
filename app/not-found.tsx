import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/layout/Footer";
import { PROGRAMS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page Not Found — CareerZeta",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#111827] to-[#1e293b] px-6 py-24 text-center md:px-10 lg:px-16 lg:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -left-10 h-64 w-64 rounded-full bg-sky-400 opacity-10 blur-[60px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -bottom-16 h-72 w-72 rounded-full bg-sky-400 opacity-8 blur-[60px]"
        />

        <div className="relative mx-auto max-w-[640px]">
          <span className="font-display text-7xl font-bold text-sky-400">
            404
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-balance text-white lg:text-[38px]">
            This page doesn&apos;t exist.
          </h1>
          <p className="mt-4 text-lg text-white opacity-80">
            The link may be broken, or the page may have moved. Let&apos;s get
            you back on track.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/"
              className="rounded-lg bg-sky-400 px-7 py-4 font-bold text-gray-900 transition-transform duration-150 hover:scale-105"
            >
              Back to Home
            </Link>
            <Link
              href="/programs"
              className="rounded-lg border-2 border-white/30 px-7 py-4 font-bold text-white transition hover:border-sky-400 hover:text-sky-400"
            >
              See programs
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/15 pt-8">
            {PROGRAMS.map((program) => (
              <Link
                key={program.slug}
                href={`/programs#${program.slug}`}
                className="text-sm text-white opacity-70 transition hover:text-sky-400 hover:opacity-100"
              >
                {program.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
