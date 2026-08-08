import ClosingCta from "@/components/home/ClosingCta";
import Hero from "@/components/home/Hero";
import OurStory from "@/components/home/OurStory";
import ProgramExplorer from "@/components/home/ProgramExplorer";
import Strengths from "@/components/home/Strengths";
import Vision from "@/components/home/Vision";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <OurStory />
      <Vision />
      <ProgramExplorer />
      <Strengths />
      <ClosingCta />
      <Footer />
    </>
  );
}
