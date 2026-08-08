"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { PROGRAMS } from "@/lib/content";

const ROW_HEIGHT = 60;

export default function ProgramExplorer() {
  const [active, setActive] = useState(0);
  const activeProgram = PROGRAMS[active];
  const ActiveIcon = activeProgram.icon;

  return (
    <section
      id="programs"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 pt-20 pb-20 md:px-10 lg:px-16 lg:pb-28"
    >
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        What we offer
      </h6>
      <h2 className="mt-3.5 font-display text-4xl font-bold">
        Six programs, one mentor-led model
      </h2>
      <p className="mt-3.5 max-w-[60ch] text-[17px] leading-relaxed opacity-75">
        Courses driven by qualified mentors, helping learners keep pace with
        tech development. Pick a track to see what it covers.
      </p>

      <div className="mt-11 grid overflow-hidden rounded-2xl border-2 border-line lg:grid-cols-[minmax(200px,0.8fr)_minmax(280px,1.2fr)]">
        <div className="relative border-line lg:border-r-2">
          <div
            className="absolute left-0 z-10 w-1 bg-sky-400 transition-[top] duration-300 ease-out"
            style={{ height: ROW_HEIGHT, top: active * ROW_HEIGHT }}
          />

          {PROGRAMS.map((program, i) => (
            <button
              key={program.slug}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              style={{ height: ROW_HEIGHT }}
              className={`flex w-full cursor-pointer items-center border-line px-7 text-left transition-colors duration-200 ${
                i === PROGRAMS.length - 1 ? "" : "border-b-2"
              } ${
                i === active
                  ? "bg-gray-900 text-white"
                  : "bg-white text-slate-900"
              }`}
            >
              <span className="font-display text-base font-bold">
                {program.name}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4.5 bg-white p-8 lg:p-12">
          <ActiveIcon
            className="h-10 w-10 text-sky-400"
            strokeWidth={1.5}
            aria-hidden
          />
          <div className="font-display text-[28px] font-bold">
            {activeProgram.name}
          </div>
          <p className="max-w-[56ch] text-base leading-[1.55] opacity-75">
            {activeProgram.desc}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {activeProgram.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-2xl bg-sky-100 px-3.5 py-1.5 text-[13px] font-semibold text-sky-700 transition-transform duration-150 hover:scale-105"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link
            href={`/programs#${activeProgram.slug}`}
            className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-gray-900 underline decoration-sky-400 decoration-2 underline-offset-4 transition hover:text-sky-700"
          >
            View full program details
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
