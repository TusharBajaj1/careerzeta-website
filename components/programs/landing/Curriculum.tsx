import Reveal from "@/components/ui/Reveal";
import type { ProgramLandingData } from "@/lib/programLandingData";

export default function Curriculum({
  landing,
  bg,
}: {
  landing: ProgramLandingData;
  bg: "white" | "slate";
}) {
  return (
    <section className={bg === "slate" ? "bg-slate-100" : "bg-white"}>
      <Reveal className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-16">
        <div className="text-xs font-bold tracking-[0.06em] uppercase text-sky-700">Curriculum</div>
        <h2 className="mt-3 font-display text-3xl leading-tight font-semibold tracking-tight text-pretty md:text-4xl">
          Phase by phase, from fundamentals to agentic AI
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {landing.curriculum.map((phase, i) => (
            <div
              key={phase.phase}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#111827] text-sm font-bold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="font-display text-lg font-semibold tracking-tight">{phase.phase}</div>
              </div>
              <ul className="mt-4 flex flex-col gap-2 pl-[3px]">
                {phase.modules.map((mod) => (
                  <li key={mod} className="flex items-start gap-2.5 text-[15px] leading-snug">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                    {mod}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
