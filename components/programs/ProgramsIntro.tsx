"use client";

import { useEffect, useState } from "react";

import { useReducedMotion } from "@/lib/useReducedMotion";
import type { ProgramSummary } from "@/lib/content";
import type { ProgramDetail } from "@/lib/programsDetail";

/** Reused from the Home v2 handoff — byte-identical file already in /public/home/. */
const HERO_PHOTO = "/home/pexels-googledeepmind-17485738.png";

const LEVELS: { name: ProgramDetail["level"]; n: number }[] = [
  { name: "Beginner", n: 1 },
  { name: "Intermediate", n: 2 },
  { name: "Professional", n: 3 },
];

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

/** Hero + "Find your starting point" card — a fixed level ladder, not tied to named programs. */
export function ProgramsHero() {
  const y = useScrollY();
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[640px] overflow-hidden bg-[#0b1220] text-white">
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-[60%] bg-cover bg-center"
        style={{
          backgroundImage: `url(${HERO_PHOTO})`,
          transform: reducedMotion
            ? undefined
            : `translateY(${Math.round(y * -0.06)}px) scale(1.08)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#0b1220] from-[42%] via-[#0b1220]/80 via-[58%] to-[#0b1220]/25"
      />
      <div className="relative mx-auto grid max-w-[1400px] items-end gap-12 px-6 pt-40 pb-28 md:px-10 lg:grid-cols-2 lg:px-16">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-sky-300/50 px-[18px] py-2 text-[13px] font-bold tracking-[0.06em] text-sky-300 uppercase">
            Our programs
          </div>
          <h1 className="font-display text-[clamp(38px,5.2vw,76px)] leading-[1.02] font-semibold tracking-[-0.03em] text-pretty">
            Six programs, one{" "}
            <span className="whitespace-nowrap text-sky-400">mentor-led</span>{" "}
            model
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg text-slate-300">
            Live batches, taught by mentors working in the field today. Pick
            the program that matches where you are and where you want to go.
          </p>
        </div>
        <div className="rounded-3xl border border-sky-300/30 bg-[#0b1220]/70 px-[30px] pt-[26px] pb-2.5 backdrop-blur">
          <div className="mb-2 text-xs font-bold tracking-[0.06em] text-sky-400 uppercase">
            Find your starting point
          </div>
          {LEVELS.map((l) => (
            <div
              key={l.name}
              className="flex items-center gap-[18px] border-t border-slate-200/20 py-4"
            >
              <div className="flex flex-none gap-[5px]" aria-hidden>
                {[1, 2, 3].map((k) => (
                  <span
                    key={k}
                    className={`h-7 w-2.5 rounded-[5px] ${k <= l.n ? "bg-sky-400" : "bg-slate-200/25"}`}
                  />
                ))}
              </div>
              <div className="font-display text-lg font-semibold">
                {l.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProgramPills({ programs }: { programs: ProgramSummary[] }) {
  return (
    <div className="sticky top-20 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      {/* Mobile: a single horizontally-scrolling row — flex-wrap here would
          stack all six pills and, being sticky, bury the section below it
          under a near-full-screen bar. Desktop has room to wrap instead. */}
      <div className="mx-auto flex max-w-[1400px] gap-2.5 overflow-x-auto px-6 py-3 [scrollbar-width:none] md:flex-wrap md:overflow-visible md:px-10 [&::-webkit-scrollbar]:hidden lg:px-16">
        {programs.map((p, i) => (
          <a
            key={p.slug}
            href={`#${p.slug}`}
            className="flex shrink-0 items-center gap-2 rounded-full bg-sky-100 px-[18px] py-[9px] text-sm font-bold whitespace-nowrap text-[#111827] transition-transform duration-150 hover:scale-105"
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
