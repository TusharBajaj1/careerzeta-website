import Reveal from "@/components/ui/Reveal";
import { SHARED_TOOLS, type ProgramLandingData } from "@/lib/programLandingData";

export default function SkillsAndTools({
  landing,
  bg,
}: {
  landing: ProgramLandingData;
  bg: "white" | "slate";
}) {
  return (
    <section className={bg === "slate" ? "bg-slate-100" : "bg-white"}>
      <Reveal className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-16">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <div className="text-xs font-bold tracking-[0.06em] uppercase text-sky-700">
              Skills you&apos;ll master
            </div>
            <h2 className="mt-3 font-display text-2xl leading-tight font-semibold tracking-tight md:text-3xl">
              What you&apos;ll walk away able to do
            </h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {landing.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-sky-100 px-4 py-2 text-sm font-bold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold tracking-[0.06em] uppercase text-sky-700">
              Tools you&apos;ll use
            </div>
            <h2 className="mt-3 font-display text-2xl leading-tight font-semibold tracking-tight md:text-3xl">
              The real tools of the trade
            </h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {SHARED_TOOLS.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full bg-[#111827] px-4 py-2 text-sm font-bold text-white"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
