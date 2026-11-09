import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Footer from "@/components/layout/Footer";
import CapstoneAndCaseStudies from "@/components/programs/landing/CapstoneAndCaseStudies";
import CareerServices from "@/components/programs/landing/CareerServices";
import Curriculum from "@/components/programs/landing/Curriculum";
import HowToJoinSteps from "@/components/programs/landing/HowToJoinSteps";
import LandingFinalCta from "@/components/programs/landing/LandingFinalCta";
import LandingHero from "@/components/programs/landing/LandingHero";
import Projects from "@/components/programs/landing/Projects";
import SkillsAndTools from "@/components/programs/landing/SkillsAndTools";
import WhoItsFor from "@/components/programs/landing/WhoItsFor";
import WhyAndGlance from "@/components/programs/landing/WhyAndGlance";
import { buildCourseJsonLd } from "@/lib/courseJsonLd";
import { PROGRAMS } from "@/lib/content";
import { PROGRAM_LANDING_DATA } from "@/lib/programLandingData";
import { PROGRAM_DETAILS } from "@/lib/programsDetail";
import { buildMetadata } from "@/lib/seo";

function getPageData(slug: string) {
  const program = PROGRAMS.find((p) => p.slug === slug);
  const detail = PROGRAM_DETAILS.find((d) => d.slug === slug);
  const landing = PROGRAM_LANDING_DATA.find((l) => l.slug === slug);
  if (!program || !detail || !landing) return null;
  return { program, detail, landing };
}

/** Only the programs with a brochure-sourced landing page get this route; the rest fall through to notFound() and stay on /programs#slug. */
export function generateStaticParams() {
  return PROGRAM_LANDING_DATA.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getPageData(slug);
  if (!data) return buildMetadata({ title: "Program not found — CareerZeta", description: "", path: `/programs/${slug}` });

  const { program } = data;
  return buildMetadata({
    title: `${program.name} — CareerZeta`,
    description: program.desc,
    path: `/programs/${program.slug}`,
  });
}

export default async function ProgramLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getPageData(slug);
  if (!data) notFound();

  const { program, detail, landing } = data;
  // LandingHero/LandingFinalCta are Client Components — Program.icon is a
  // function and can't cross that boundary as a prop (same pitfall
  // /programs/page.tsx strips out via its own programSummaries map).
  const programSummary = { slug: program.slug, name: program.name };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...buildCourseJsonLd(program, detail),
            url: `https://www.careerzeta.com/programs/${program.slug}`,
          }),
        }}
      />

      <LandingHero program={programSummary} detail={detail} landing={landing} />
      <WhyAndGlance landing={landing} bg="white" />
      <WhoItsFor landing={landing} bg="slate" />
      <Curriculum landing={landing} bg="white" />
      <SkillsAndTools landing={landing} bg="slate" />
      <Projects landing={landing} bg="white" />
      <CapstoneAndCaseStudies landing={landing} />
      <CareerServices programName={program.name} bg="white" />
      <HowToJoinSteps programName={program.name} />
      <LandingFinalCta programSlug={program.slug} programName={program.name} detail={detail} />

      <Footer />
    </>
  );
}
