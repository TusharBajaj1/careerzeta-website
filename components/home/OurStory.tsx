import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";

const ERAS = [
  { d: "1980s", t: "Personal computers reach the desk", c: "bg-slate-200", s: "text-[44px]" },
  { d: "1990s", t: "The internet connects them", c: "bg-sky-100", s: "text-[52px]" },
  { d: "2010s", t: "Mobile and cloud rewrite the job", c: "bg-sky-400", s: "text-[60px]" },
  { d: "2020s", t: "AI compresses the timeline further", c: "bg-gray-900 text-white", s: "text-[68px]" },
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
      <h2 className="mt-3.5 max-w-[24ch] font-display text-4xl font-bold text-balance">
        We have seen technology evolve since Personal Computers were
        developed.
      </h2>
      <p className="mt-4 max-w-[60ch] text-lg leading-relaxed opacity-75">
        The world has changed, and the tech has changed faster than anything.
        CareerZeta exists to help professionals keep up with it.
      </p>

      {/* Decade type grows and colour deepens: the timeline visibly speeds up. */}
      <StaggerGroup className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ERAS.map((e) => (
          <StaggerItem
            key={e.d}
            className={`flex min-h-[190px] flex-col gap-3.5 rounded-2xl p-7 transition-transform duration-150 hover:-translate-y-2 ${e.c}`}
          >
            <div className={`font-display leading-none font-bold ${e.s}`}>
              {e.d}
            </div>
            <div className="text-base leading-normal font-medium">{e.t}</div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Reveal>
  );
}
