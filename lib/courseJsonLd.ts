import type { Program } from "@/lib/content";
import type { ProgramDetail } from "@/lib/programsDetail";
import { parseFeeStringToRupees } from "@/lib/money";

const SITE_URL = "https://www.careerzeta.com";

/** "6 months" / "12 months" -> ISO 8601 duration ("P6M" / "P12M"). */
function toIsoDuration(duration: string | null): string | undefined {
  const match = duration?.match(/(\d+)\s*month/i);
  return match ? `P${match[1]}M` : undefined;
}

/** Builds a schema.org/Course entry so each program is eligible for Google's Course rich result. */
export function buildCourseJsonLd(program: Program, detail: ProgramDetail) {
  const rupees = parseFeeStringToRupees(detail.fee);
  const price = rupees ? String(rupees) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.name,
    description: program.desc,
    url: `${SITE_URL}/programs#${program.slug}`,
    provider: {
      "@type": "EducationalOrganization",
      name: "CareerZeta",
      sameAs: SITE_URL,
    },
    educationalLevel: detail.level,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: toIsoDuration(detail.duration),
    },
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "INR",
        category: "Paid",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/programs#${program.slug}`,
      },
    }),
  };
}
