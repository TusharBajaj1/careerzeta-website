import type { Metadata } from "next";
import Link from "next/link";

import HowWeOperate from "@/components/programs/HowWeOperate";
import ProgramSection from "@/components/programs/ProgramSection";
import { ProgramPills, ProgramsHero } from "@/components/programs/ProgramsIntro";
import Reveal from "@/components/ui/Reveal";
import Footer from "@/components/layout/Footer";
import { PROGRAMS } from "@/lib/content";
import { PROGRAM_DETAILS } from "@/lib/programsDetail";

export const metadata: Metadata = {
  title: "Programs — CareerZeta",
  description:
    "Six mentor-led programs — Data Analytics & Agentic AI, Business Analytics & Agentic AI, PG Program in Data Science & AI, Generative & Agentic AI, Investment Banking with AI immersion and Cybersecurity with AI immersion.",
};

export default function ProgramsPage() {
  return (
    <>
      <ProgramsHero />
      <ProgramPills programs={PROGRAMS} />

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

      <Reveal className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-gray-900 px-6 py-14 text-center md:px-10 lg:px-16 lg:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -left-10 h-64 w-64 rounded-full bg-sky-400 opacity-10 blur-[60px] cz-float-blob-1"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -bottom-16 h-72 w-72 rounded-full bg-sky-400 opacity-8 blur-[60px] cz-float-blob-2"
        />

        <div className="relative mx-auto max-w-[800px]">
          <h2 className="font-display text-[38px] font-bold text-white">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-white opacity-80">
            Talk to us about which program fits where you are today.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-block rounded-lg bg-sky-400 px-8 py-4 text-[17px] font-bold text-slate-900 transition-transform duration-150 hover:scale-105 cz-pulse-glow"
          >
            Get Admission
          </Link>
        </div>
      </Reveal>

      <Footer />
    </>
  );
}
