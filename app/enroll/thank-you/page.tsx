import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/layout/Footer";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Thank You — CareerZeta",
  description: "Thanks for enrolling with CareerZeta.",
  robots: { index: false, follow: false },
};

export default function EnrollThankYouPage() {
  return (
    <>
      <section className="mx-auto max-w-[640px] px-6 py-24 text-center md:px-10">
        <h1 className="font-display text-3xl font-bold text-balance">
          Thanks for enrolling!
        </h1>
        <p className="mt-4 text-lg opacity-75">
          We&apos;ve received your payment. A confirmation and invoice will land in your
          inbox shortly, and our team will be in touch with the next steps.
        </p>
        <p className="mt-4 text-sm opacity-60">
          Questions in the meantime? Reach us at{" "}
          <a href={`mailto:${CONTACT.email}`} className="font-semibold text-sky-700 hover:underline">
            {CONTACT.email}
          </a>
          .
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-sky-400 px-8 py-4 text-[17px] font-bold text-slate-900 transition-transform duration-150 hover:scale-105"
        >
          Back to Home
        </Link>
      </section>
      <Footer />
    </>
  );
}
