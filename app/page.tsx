import ClosingCta from "@/components/home/ClosingCta";
import ContactStrip from "@/components/home/ContactStrip";
import Credentials from "@/components/home/Credentials";
import Faq from "@/components/home/Faq";
import Hero from "@/components/home/Hero";
import HowWeOperate from "@/components/home/HowWeOperate";
import Marquee from "@/components/home/Marquee";
import Mentors from "@/components/home/Mentors";
import OurStory from "@/components/home/OurStory";
import ProgramExplorer from "@/components/home/ProgramExplorer";
import Strengths from "@/components/home/Strengths";
import Vision from "@/components/home/Vision";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <OurStory />
      <Vision />
      <ProgramExplorer />
      <Strengths />
      <HowWeOperate />
      <Credentials />
      <Mentors />
      <Faq />
      <ClosingCta />
      <ContactStrip />
      <Footer />
    </>
  );
}
