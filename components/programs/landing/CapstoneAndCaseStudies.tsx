import { Factory } from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import type { ProgramLandingData } from "@/lib/programLandingData";

export default function CapstoneAndCaseStudies({ landing }: { landing: ProgramLandingData }) {
  return (
    <section className="bg-[#0b1220] text-white">
      <Reveal className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-16">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="text-xs font-bold tracking-[0.06em] uppercase text-sky-400">
              Capstone &amp; portfolio
            </div>
            <h2 className="mt-3 font-display text-3xl leading-tight font-semibold tracking-tight text-pretty">
              A capstone that proves you can do the job
            </h2>
            <ul className="mt-7 flex flex-col gap-3.5">
              {landing.capstone.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-normal text-slate-300">
                  <span className="mt-[7px] h-2.5 w-2.5 shrink-0 rounded-full bg-sky-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold tracking-[0.06em] uppercase text-sky-400">
              Industry case studies
            </div>
            <h2 className="mt-3 font-display text-2xl leading-tight font-semibold tracking-tight">
              Real problems, across real industries
            </h2>
            <StaggerGroup className="mt-6 grid gap-3.5 sm:grid-cols-2">
              {landing.caseStudies.map((cs) => (
                <StaggerItem
                  key={cs.title}
                  className="rounded-2xl border border-sky-300/20 bg-[#111c33] p-5"
                >
                  <div className="flex items-center gap-2 text-xs font-bold tracking-[0.05em] text-sky-400 uppercase">
                    <Factory className="h-3.5 w-3.5" />
                    {cs.industry}
                  </div>
                  <div className="mt-2 text-[15px] leading-snug font-bold">{cs.title}</div>
                  <p className="mt-1.5 text-sm leading-normal text-slate-300">{cs.description}</p>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
