import type { Metadata } from "next";

import Footer from "@/components/layout/Footer";
import Newsletter from "@/components/resources/Newsletter";
import RealWorldStories from "@/components/resources/RealWorldStories";
import ReportsResearch from "@/components/resources/ReportsResearch";
import ResourcesHero from "@/components/resources/ResourcesHero";

export const metadata: Metadata = {
  title: "Resources — CareerZeta",
  description:
    "Real-world stories and credible research on how data, analytics and AI are changing the way businesses work.",
};

export default function ResourcesPage() {
  return (
    <>
      <ResourcesHero />
      <RealWorldStories />
      <ReportsResearch />
      <Newsletter />
      <Footer />
    </>
  );
}
