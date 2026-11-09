import { Sparkles } from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import { careerServices } from "@/lib/programLandingData";

export default function CareerServices({
  programName,
  bg,
}: {
  programName: string;
  bg: "white" | "slate";
}) {
  const items = careerServices(programName);

  return (
    <section className={bg === "slate" ? "bg-slate-100" : "bg-white"}>
      <Reveal className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-16">
        <div className="text-xs font-bold tracking-[0.06em] uppercase text-sky-700">Career services</div>
        <h2 className="mt-3 font-display text-3xl leading-tight font-semibold tracking-tight text-pretty md:text-4xl">
          What we offer beyond the classroom
        </h2>

        <StaggerGroup className="mt-9 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <StaggerItem
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-[15px] leading-normal"
            >
              <Sparkles className="mt-0.5 h-5 w-5 flex-none text-sky-500" />
              {item}
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Reveal>
    </section>
  );
}
