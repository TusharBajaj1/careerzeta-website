import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";

const milestones = [
  { year: "1980s", text: "Personal computers reach the desk" },
  { year: "1990s", text: "The internet connects them" },
  { year: "2010s", text: "Mobile and cloud rewrite the job" },
  { year: "2020s", text: "AI compresses the timeline further", live: true },
];

export default function OurStory() {
  return (
    <Reveal
      id="story"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-16 md:px-10 lg:px-16 lg:py-20"
    >
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        Why we started
      </h6>
      <h2 className="mt-3.5 max-w-[24ch] font-display text-4xl font-bold">
        We have seen technology evolve since Personal Computers were developed.
      </h2>
      <p className="mt-4 max-w-[60ch] text-lg leading-relaxed opacity-75">
        The world has changed, and the tech has changed faster than anything.
        CareerZeta exists to help professionals keep up with it.
      </p>

      <StaggerGroup className="relative mt-14 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="absolute top-3.5 right-[2%] left-[2%] z-0 hidden h-[3px] bg-line lg:block" />

        {milestones.map((milestone) => (
          <StaggerItem key={milestone.year} className="relative z-10 pr-6">
            <div
              className={`h-7 w-7 rounded-full ${
                milestone.live ? "bg-sky-400 cz-dot-pulse" : "bg-gray-900"
              }`}
            />
            <div className="mt-4.5 font-display text-[19px] font-bold">
              {milestone.year}
            </div>
            <div className="mt-1.5 text-[15px] opacity-65">
              {milestone.text}
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Reveal>
  );
}
