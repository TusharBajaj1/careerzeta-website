import { CheckCircle2 } from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import type { ProgramLandingData } from "@/lib/programLandingData";

export default function WhoItsFor({
  landing,
  bg,
}: {
  landing: ProgramLandingData;
  bg: "white" | "slate";
}) {
  return (
    <section className={bg === "slate" ? "bg-slate-100" : "bg-white"}>
      <Reveal className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-16">
        <div className="text-xs font-bold tracking-[0.06em] uppercase text-sky-700">Who it&apos;s for</div>
        <h2 className="mt-3 font-display text-3xl leading-tight font-semibold tracking-tight text-pretty md:text-4xl">
          Is this program right for you?
        </h2>
        <StaggerGroup className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {landing.whoItsFor.map((item) => (
            <StaggerItem
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-[15px] leading-normal"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-sky-500" />
              {item}
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Reveal>
    </section>
  );
}
