import type { Metadata } from "next";

import Footer from "@/components/layout/Footer";
import ToolsGrid from "@/components/tools/ToolsGrid";
import ToolsHero from "@/components/tools/ToolsHero";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Free Tools — CareerZeta",
  description:
    "Free tools and side projects from CareerZeta — PDF utilities, a daily vocabulary page, and more on the way.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <>
      <ToolsHero />
      <ToolsGrid />
      <Footer />
    </>
  );
}
