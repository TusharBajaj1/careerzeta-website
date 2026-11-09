import Reveal from "@/components/ui/Reveal";
import type { ProgramLandingData } from "@/lib/programLandingData";

const eyebrow = "text-xs font-bold tracking-[0.06em] uppercase text-sky-700";

export default function WhyAndGlance({
  landing,
  bg,
}: {
  landing: ProgramLandingData;
  bg: "white" | "slate";
}) {
  return (
    <section className={bg === "slate" ? "bg-slate-100" : "bg-white"}>
      <Reveal className="mx-auto grid max-w-[1400px] items-start gap-14 px-6 py-20 md:px-10 lg:grid-cols-[1.2fr_1fr] lg:px-16">
        <div>
          <div className={eyebrow}>Why this program</div>
          <h2 className="mt-3 font-display text-3xl leading-tight font-semibold tracking-tight text-pretty md:text-4xl">
            Built for where you want to go next
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {landing.whyReasons.map((reason) => (
              <li key={reason} className="flex items-start gap-3 text-base leading-normal">
                <span className="mt-[7px] h-2.5 w-2.5 shrink-0 rounded-full bg-sky-400" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-[30px] shadow-[0_24px_60px_-30px_rgba(17,24,39,.35)]">
          <div className={eyebrow}>Program at a glance</div>
          <div className="mt-5 grid grid-cols-2 gap-6">
            {landing.glance.map((g) => (
              <div key={g.label}>
                <div className="font-display text-xl font-bold text-[#111827]">{g.value}</div>
                <div className="mt-1 text-sm opacity-60">{g.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
