import type { Metadata } from "next";

import DirectEnrollLookup from "@/components/programs/DirectEnrollLookup";
import Footer from "@/components/layout/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pay Your Fee — CareerZeta",
  description: "Enter your email and phone number to pay the fee your CareerZeta counsellor shared with you.",
  path: "/enroll-direct",
});

export default function EnrollDirectPage() {
  return (
    <>
      <div className="mx-auto max-w-[560px] px-6 pt-28 pb-16 md:px-10 lg:pt-32 lg:pb-20">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">Enrollment</h6>
        <h1 className="mt-3.5 font-display text-3xl font-bold md:text-4xl">Pay your fee</h1>
        <p className="mt-3.5 text-base leading-relaxed opacity-75">
          If a CareerZeta counsellor has already set up your enrollment, enter the email and phone
          number you gave them and we&apos;ll show you exactly what&apos;s due.
        </p>

        <div className="mt-9">
          <DirectEnrollLookup />
        </div>
      </div>

      <Footer />
    </>
  );
}
