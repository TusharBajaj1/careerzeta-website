import type { Metadata } from "next";

import Footer from "@/components/layout/Footer";
import Newsletter from "@/components/resources/Newsletter";
import RealWorldStories from "@/components/resources/RealWorldStories";
import ReportsResearch from "@/components/resources/ReportsResearch";

export const metadata: Metadata = {
  title: "Resources — CareerZeta",
  description:
    "Real-world stories and credible research on how data, analytics and AI are changing the way businesses work.",
};

export default function ResourcesPage() {
  return (
    <>
      <section className="mx-auto max-w-[1400px] px-6 pt-16 pb-2 md:px-10 lg:px-16 lg:pt-20">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Resources
        </h6>
        <h1 className="mt-2 max-w-[24ch] font-display text-4xl font-bold md:text-5xl">
          Understand how data, AI and technology are changing work
        </h1>
      </section>

      <RealWorldStories />
      <ReportsResearch />
      <Newsletter />
      <Footer />
    </>
  );
}
