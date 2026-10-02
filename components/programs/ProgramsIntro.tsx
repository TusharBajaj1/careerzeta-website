import Reveal from "@/components/ui/Reveal";
import type { Program } from "@/lib/content";
import type { ProgramDetail } from "@/lib/programsDetail";

const eyebrow = "text-xs font-bold tracking-[0.06em] uppercase";

/** Hero + "Find your starting point" card — a fixed level ladder, not tied to named programs. */
export function ProgramsHero() {
  const rows: { level: ProgramDetail["level"]; n: number }[] = [
    { level: "Beginner", n: 1 },
    { level: "Intermediate", n: 2 },
    { level: "Professional", n: 3 },
  ];

  return (
    <Reveal className="mx-auto grid max-w-[1400px] items-end gap-12 px-6 pt-10 pb-10 md:grid-cols-2 md:px-10 lg:px-16">
      <div>
        <h6 className={`${eyebrow} text-sky-700`}>Our programs</h6>
        <h1 className="mt-4 font-display text-4xl leading-[1.1] font-bold text-balance lg:text-[52px]">
          Six programs, one mentor-led model
        </h1>
        <p className="mt-5 max-w-[52ch] text-lg opacity-75">
          Live batches, taught by mentors working in the field today. Pick
          the program that matches where you are and where you want to go.
        </p>
      </div>
      <div className="rounded-2xl bg-gray-900 px-8 pt-7 pb-3.5 text-white">
        <div className={`${eyebrow} mb-4 text-sky-400`}>
          Find your starting point
        </div>
        {rows.map((r) => (
          <div
            key={r.level}
            className="flex items-center gap-[18px] border-t border-white/10 py-[18px]"
          >
            <div className="flex flex-none gap-[5px]" aria-hidden>
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`h-7 w-2.5 rounded-[5px] ${
                    n <= r.n ? "bg-sky-400" : "bg-white/15"
                  }`}
                />
              ))}
            </div>
            <div className="font-display text-lg font-bold">{r.level}</div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export function ProgramPills({ programs }: { programs: Program[] }) {
  return (
    <div className="sticky top-20 z-20 border-y border-line bg-[#fafafa]/95 backdrop-blur">
      {/* Mobile: a single horizontally-scrolling row — flex-wrap here would
          stack all six pills and, being sticky, bury the section below it
          under a near-full-screen bar. Desktop has room to wrap instead. */}
      <div className="mx-auto flex max-w-[1400px] gap-2.5 overflow-x-auto px-6 py-3 [scrollbar-width:none] md:flex-wrap md:overflow-visible md:px-10 [&::-webkit-scrollbar]:hidden lg:px-16">
        {programs.map((p, i) => (
          <a
            key={p.slug}
            href={`#${p.slug}`}
            className="flex shrink-0 items-center gap-2 rounded-full bg-sky-100 px-[18px] py-[9px] text-sm font-bold whitespace-nowrap text-gray-900 transition-transform duration-150 hover:scale-105"
          >
            <span className="text-sky-700">
              {String(i + 1).padStart(2, "0")}
            </span>
            {p.name}
          </a>
        ))}
      </div>
    </div>
  );
}
