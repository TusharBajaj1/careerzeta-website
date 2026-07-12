import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import IndustryOverview from "@/components/home/Industryoverview";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <IndustryOverview />
    </>
  );
}