import type { Metadata } from "next";
import Link from "next/link";

import HowWeOperate from "@/components/programs/HowWeOperate";
import ProgramSection from "@/components/programs/ProgramSection";
import Reveal from "@/components/ui/Reveal";
import Footer from "@/components/layout/Footer";
import { PROGRAMS } from "@/lib/content";
import { PROGRAM_DETAILS } from "@/lib/programsDetail";

export const metadata: Metadata = {
  title: "Programs — CareerZeta",
  description:
    "Six mentor-led programs — Data Analytics, Business Analytics, Applied AI, Agentic AI, Machine Learning and Data Science.",
};

export default function ProgramsPage() {
  return (
    <>
      <section className="mx-auto max-w-[1400px] px-6 pt-16 pb-8 text-center md:px-10 lg:px-16 lg:pt-24">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Our programs
        </h6>
        <h1 className="mx-auto mt-3.5 max-w-[20ch] font-display text-4xl font-bold md:text-5xl">
          Six programs, one mentor-led model
        </h1>
        <p className="mx-auto mt-5 max-w-[60ch] text-lg leading-relaxed opacity-75">
          Every program follows the same model — live classes, mentor-led
          practice, and a certificate that means the program was finished.
          Scroll through to find the one that matches where you want to go
          next.
        </p>
      </section>

      {PROGRAMS.map((program, index) => {
        const detail = PROGRAM_DETAILS.find((d) => d.slug === program.slug);
        if (!detail) return null;
        return (
          <ProgramSection
            key={program.slug}
            program={program}
            detail={detail}
            index={index}
          />
        );
      })}

      <HowWeOperate />

      <Reveal className="bg-gradient-to-br from-slate-900 to-gray-900 px-6 py-20 text-center md:px-10 lg:px-16 lg:py-25">
        <div className="mx-auto max-w-[800px]">
          <h2 className="font-display text-[38px] font-bold text-white">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-white opacity-80">
            Talk to us about which program fits where you are today.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-block rounded-lg bg-sky-400 px-8 py-4 text-[17px] font-bold text-slate-900 transition-transform duration-150 hover:scale-105"
          >
            Get Admission
          </Link>
        </div>
      </Reveal>

      <Footer />
    </>
  );
}
