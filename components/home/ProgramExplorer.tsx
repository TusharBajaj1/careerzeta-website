"use client";

import Link from "next/link";
import { useState } from "react";

import Reveal from "@/components/ui/Reveal";
import { PROGRAMS } from "@/lib/content";

export default function ProgramExplorer() {
  const [active, setActive] = useState(0);
  const program = PROGRAMS[active];

  return (
    <Reveal
      id="programs"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-16 md:px-10 lg:px-16 lg:py-20"
    >
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        What we offer
      </h6>
      <h2 className="mt-3.5 font-display text-4xl font-bold">
        Six programs, one mentor-led model
      </h2>
      <p className="mt-3.5 max-w-[60ch] text-lg leading-relaxed opacity-75">
        Courses driven by qualified mentors, helping learners keep pace with
        tech development. Pick a track to see what it covers.
      </p>

      <div role="tablist" className="mt-8 flex flex-wrap gap-2.5">
        {PROGRAMS.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`cursor-pointer rounded-full px-[22px] py-[11px] text-[15px] font-bold transition-transform duration-150 hover:scale-105 ${
              i === active ? "bg-gray-900 text-white" : "bg-sky-100 text-gray-900"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        className="mt-6 grid overflow-hidden rounded-2xl bg-sky-100 md:grid-cols-2"
      >
        <div className="flex flex-col items-start justify-center gap-[18px] p-8 lg:p-12">
          <div className="font-display text-6xl leading-none font-bold text-sky-400">
            {String(active + 1).padStart(2, "0")}
          </div>
          <h3 className="font-display text-[28px] font-bold">{program.name}</h3>
          <p className="max-w-[52ch] text-[17px] leading-relaxed">
            {program.desc}
          </p>
          <Link
            href={`/programs#${program.slug}`}
            className="rounded-lg bg-gray-900 px-6 py-3.5 text-[15px] font-bold text-white transition-transform duration-150 hover:scale-105"
          >
            View full program details →
          </Link>
        </div>
        <div className="flex flex-col justify-center gap-4 bg-gray-900 p-8 lg:p-12">
          <div className="text-xs font-bold tracking-[0.06em] text-sky-400 uppercase">
            What it covers
          </div>
          <div className="flex flex-wrap gap-2.5">
            {program.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-sky-100 px-[18px] py-2.5 text-[15px] font-bold text-gray-900"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
