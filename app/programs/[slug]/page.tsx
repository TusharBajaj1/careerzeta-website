import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Footer from "@/components/layout/Footer";
import {
  AudienceSection,
  CareerLadder,
  CareerServices,
  CaseStudies,
  Capstone,
  Curriculum,
  FloatingEnroll,
  JoinAndCta,
  ProgramDetailHero,
  Projects,
  SkillsAndTools,
  ToolTicker,
  WhySection,
} from "@/components/programs/detail/ProgramDetailSections";
import { buildCourseJsonLd } from "@/lib/courseJsonLd";
import { PROGRAMS } from "@/lib/content";
import { PROGRAM_DETAIL_PAGES } from "@/lib/programDetailPage";
import { PROGRAM_DETAILS } from "@/lib/programsDetail";
import { buildMetadata } from "@/lib/seo";

function getPageData(slug: string) {
  const program = PROGRAMS.find((p) => p.slug === slug);
  const detail = PROGRAM_DETAILS.find((d) => d.slug === slug);
  const page = PROGRAM_DETAIL_PAGES.find((d) => d.slug === slug);
  if (!program || !detail || !page) return null;
  return { program, detail, page };
}

/** Only the programs with a brochure-sourced detail page get this route; the rest fall through to notFound() and stay on /programs#slug. */
export function generateStaticParams() {
  return PROGRAM_DETAIL_PAGES.map((p) => ({ slug: p.slug }));
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

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getPageData(slug);
  if (!data) notFound();

  const { program, detail, page } = data;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildCourseJsonLd(program, detail, `https://www.careerzeta.com/programs/${program.slug}`),
          ),
        }}
      />

      <ProgramDetailHero p={page} />
      <ToolTicker groups={page.toolGroups} />
      <WhySection items={page.why} />
      <CareerLadder rungs={page.ladder} />
      <AudienceSection items={page.audience} />
      <Curriculum p={page} />
      <SkillsAndTools p={page} />
      <Projects items={page.projects} />
      <Capstone items={page.capstone} />
      <CaseStudies items={page.caseStudies} />
      <CareerServices items={page.career} />
      <JoinAndCta p={page} />
      <FloatingEnroll p={page} />

      <div className="pb-24">
        <Footer />
      </div>
    </>
  );
}
