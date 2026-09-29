import type { Metadata } from "next";

import AboutCta from "@/components/about/AboutCta";
import Founders from "@/components/about/Founders";
import LearningPath from "@/components/about/LearningPath";
import Organisations from "@/components/about/Organisations";
import VisionHero from "@/components/about/VisionHero";
import WhyWeStarted from "@/components/about/WhyWeStarted";
import Mentors from "@/components/home/Mentors";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About Us — CareerZeta",
  description:
    "Why CareerZeta exists, the mentors leading our programs, and the learning path every learner follows from first class to certification.",
};

export default function AboutPage() {
  return (
    <>
      <VisionHero />
      <WhyWeStarted />
      <Mentors heading="Mentors Leading the Programs" />
      <LearningPath />
      <Organisations />
      <Founders />
      <AboutCta />
      <Footer />
    </>
  );
}
