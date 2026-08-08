import type { Metadata } from "next";

import Founders from "@/components/about/Founders";
import LearningPath from "@/components/about/LearningPath";
import UpskillingDestinations from "@/components/about/UpskillingDestinations";
import WhyWeStarted from "@/components/about/WhyWeStarted";
import Mentors from "@/components/home/Mentors";
import Vision from "@/components/home/Vision";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About Us — CareerZeta",
  description:
    "Why CareerZeta exists, the mentors leading our programs, and the learning path every learner follows from first class to certification.",
};

export default function AboutPage() {
  return (
    <>
      <Vision />
      <WhyWeStarted />
      <Mentors heading="Mentors Leading the Programs" />
      <LearningPath />
      <UpskillingDestinations />
      <Founders />
      <Footer />
    </>
  );
}
