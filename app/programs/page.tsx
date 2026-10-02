import type { Metadata } from "next";

import HowWeOperate from "@/components/programs/HowWeOperate";
import ProgramSection from "@/components/programs/ProgramSection";
import ProgramsCta from "@/components/programs/ProgramsCta";
import { ProgramPills, ProgramsHero } from "@/components/programs/ProgramsIntro";
import Footer from "@/components/layout/Footer";
import { PROGRAMS } from "@/lib/content";
import { PROGRAM_DETAILS } from "@/lib/programsDetail";

export const metadata: Metadata = {
  title: "Programs — CareerZeta",
  description:
    "Six mentor-led programs — Data Analytics & Agentic AI, Business Analytics & Agentic AI, PG Program in Data Science & AI, Generative & Agentic AI, Investment Banking with AI immersion and Cybersecurity with AI immersion.",
};

export default function ProgramsPage() {
  // ProgramsHero/ProgramPills/ProgramSection are Client Components; strip
  // PROGRAMS down to its serializable fields before crossing that boundary
  // (Program.icon is a function and can't be passed as a prop).
  const programSummaries = PROGRAMS.map(({ slug, name }) => ({ slug, name }));

  return (
    <>
      <ProgramsHero />
      <ProgramPills programs={programSummaries} />

      {programSummaries.map((program, index) => {
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
      <ProgramsCta />

      <Footer />
    </>
  );
}
