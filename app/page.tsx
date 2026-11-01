import ClosingCta from "@/components/home/ClosingCta";
import Hero from "@/components/home/Hero";
import OurStory from "@/components/home/OurStory";
import ProgramExplorer from "@/components/home/ProgramExplorer";
import Strengths from "@/components/home/Strengths";
import Ticker from "@/components/home/Ticker";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <OurStory />
      <ProgramExplorer />
      <Strengths />
      <ClosingCta />
      <Footer />
    </>
  );
}
