"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Reveal from "@/components/ui/Reveal";
import { PROGRAMS } from "@/lib/content";

/** One representative photo per program, from the Home v2 handoff. */
const PHOTOS: Record<string, string> = {
  "data-analytics": "/home/pexels-rdne-7580704.png",
  "business-analytics": "/home/pexels-karola-g-7876668.png",
  "data-science": "/home/pexels-cottonbro-5473956.png",
  "generative-agentic-ai": "/home/pexels-googledeepmind-18069697.png",
  "investment-banking": "/home/pexels-tima-miroshnichenko-7567482.png",
  "cyber-security": "/home/pexels-shkrabaanthony-5475760.png",
};

export default function ProgramExplorer() {
  const [active, setActive] = useState(0);
  const program = PROGRAMS[active];

  return (
    <section className="bg-slate-100">
      <Reveal
        id="programs"
        className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-20 md:px-10 lg:px-16 lg:py-[110px]"
      >
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          What we offer
        </h6>
        <h2 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight lg:text-5xl">
          Six programs, one mentor-led model
        </h2>
        <p className="mt-4 max-w-[60ch] text-lg text-slate-800">
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
              className={`cursor-pointer rounded-full px-6 py-3 text-[15px] font-bold transition-transform duration-150 hover:scale-105 ${
                i === active ? "bg-[#111827] text-white" : "bg-white text-[#111827]"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          className="mt-6 grid overflow-hidden rounded-[28px] bg-white shadow-[0_30px_70px_-30px_rgba(17,24,39,.4)] md:grid-cols-2"
        >
          <div className="flex flex-col items-start justify-center gap-[18px] p-8 lg:p-[52px]">
            <div className="font-display text-[120px] leading-[.9] font-semibold tracking-[-0.05em] text-sky-400">
              {String(active + 1).padStart(2, "0")}
            </div>
            <h3 className="font-display text-[34px] font-semibold tracking-tight">
              {program.name}
            </h3>
            <p className="max-w-[50ch] text-[17px] leading-normal">
              {program.desc}
            </p>
            <Link
              href={`/programs#${program.slug}`}
              className="rounded-full bg-[#111827] px-[26px] py-[15px] text-[15px] font-bold text-white transition-transform duration-150 hover:scale-105"
            >
              View full program details →
            </Link>
          </div>
          <div className="flex flex-col justify-center gap-[18px] bg-gradient-to-br from-[#111827] to-[#1e3a5f] px-8 pt-7 pb-11 lg:px-10">
            <div className="relative h-[220px] overflow-hidden rounded-[20px]">
              <Image
                key={program.slug}
                src={PHOTOS[program.slug]}
                alt=""
                fill
                sizes="(min-width:768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="text-xs font-bold tracking-[0.06em] text-sky-400 uppercase">
              What it covers
            </div>
            <div className="flex flex-wrap gap-2.5">
              {program.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-sky-100 px-5 py-[11px] text-[15px] font-bold text-[#111827]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
