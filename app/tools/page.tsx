import type { Metadata } from "next";
import { desc } from "drizzle-orm";

import Footer from "@/components/layout/Footer";
import ToolsGrid from "@/components/tools/ToolsGrid";
import ToolsHero from "@/components/tools/ToolsHero";
import { db } from "@/lib/db";
import { wordOfTheDay } from "@/lib/db/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Free Tools — CareerZeta",
  description:
    "Free tools and side projects from CareerZeta — PDF utilities, a daily vocabulary page, and more on the way.",
  path: "/tools",
});

// Reads the latest word_of_the_day row on every request (set via
// /admin/word-of-the-day) — never statically prerendered, so an update
// there shows up here immediately with no redeploy.
export const dynamic = "force-dynamic";

export default async function ToolsPage() {
  const [latestWord] = await db.select().from(wordOfTheDay).orderBy(desc(wordOfTheDay.id)).limit(1);

  return (
    <>
      <ToolsHero />
      <ToolsGrid
        word={latestWord?.word ?? "Sanguine"}
        definition={latestWord?.definition ?? "cheerful and hopeful, even in tough times"}
      />
      <Footer />
    </>
  );
}
