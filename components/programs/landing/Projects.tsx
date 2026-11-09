import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import type { DifficultyLevel, ProgramLandingData } from "@/lib/programLandingData";

const DIFFICULTY_STYLE: Record<DifficultyLevel, string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
};

export default function Projects({
  landing,
  bg,
}: {
  landing: ProgramLandingData;
  bg: "white" | "slate";
}) {
  return (
    <section className={bg === "slate" ? "bg-slate-100" : "bg-white"}>
      <Reveal className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-16">
        <div className="text-xs font-bold tracking-[0.06em] uppercase text-sky-700">Course projects</div>
        <h2 className="mt-3 font-display text-3xl leading-tight font-semibold tracking-tight text-pretty md:text-4xl">
          Build a portfolio as you go
        </h2>

        <StaggerGroup className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {landing.projects.map((project) => (
            <StaggerItem
              key={project.title}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${DIFFICULTY_STYLE[project.difficulty]}`}
              >
                {project.difficulty}
              </span>
              <div className="text-[15px] leading-snug font-bold">{project.title}</div>
              <p className="text-sm leading-normal opacity-70">{project.description}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Reveal>
    </section>
  );
}
