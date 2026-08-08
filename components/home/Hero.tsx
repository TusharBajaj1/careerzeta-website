"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ImageIcon, TrendingUp } from "lucide-react";

import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import { EXTERNAL_STAT, PROGRAMS } from "@/lib/content";

const strip =
  "6 Programs · Live Batches · Mentor-led · Certified · Placement Support";

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setWordIndex((i) => (i + 1) % PROGRAMS.length),
      2400,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative mx-auto max-w-[1400px] overflow-hidden px-6 pt-16 md:px-10 lg:px-16 lg:pt-[90px]"
    >
      <div className="pointer-events-none absolute -top-[60px] -left-[60px] z-0 h-[220px] w-[220px] rounded-full bg-sky-400 opacity-12 blur-[30px] cz-float-blob-1" />
      <div className="pointer-events-none absolute bottom-5 left-[38%] z-0 h-[180px] w-[180px] rounded-full bg-gray-900 opacity-8 blur-[30px] cz-float-blob-2" />

      <svg
        aria-hidden
        className="pointer-events-none absolute top-[60px] right-[6%] z-0 hidden h-13 w-13 opacity-18 cz-float-slow lg:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#111827"
        strokeWidth={1.5}
      >
        <path d="M4 20V10M12 20V4M20 20v-7" />
      </svg>
      <svg
        aria-hidden
        className="pointer-events-none absolute top-[220px] right-[16%] z-0 hidden h-10 w-10 opacity-16 cz-float-blob-2 lg:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#38bdf8"
        strokeWidth={1.5}
      >
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
        <circle cx="17" cy="9" r="2.6" />
        <path d="M15.5 14.5c2.6.3 4.5 2.2 4.5 5" />
      </svg>
      <svg
        aria-hidden
        className="pointer-events-none absolute bottom-[60px] left-[4%] z-0 hidden h-11 w-11 opacity-14 cz-float-slow lg:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#111827"
        strokeWidth={1.5}
      >
        <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
      </svg>

      <div className="relative z-10 grid items-center gap-14 lg:grid-cols-[minmax(320px,1.3fr)_minmax(280px,1fr)]">
        <div>
          <span className="inline-block rounded-[20px] bg-sky-100 px-4 py-2 text-sm font-bold text-sky-700 cz-fade-in-up">
            Online courses &amp; mentorship
          </span>

          <h1 className="mt-6 font-display text-[clamp(34px,4.2vw,60px)] leading-[1.1] font-bold cz-fade-in-up [animation-delay:0.08s]">
            Stop waiting. Start building your future.
          </h1>

          <p className="mt-[22px] max-w-[46ch] text-[clamp(16px,1.6vw,19px)] leading-[1.55] opacity-75 cz-fade-in-up [animation-delay:0.16s]">
            Technology has changed faster than anything since the personal
            computer. CareerZeta pairs learners with qualified mentors so
            professionals keep moving with it, not behind it.
          </p>

          <div className="mt-[18px] flex items-center gap-2.5 text-[15px] opacity-60">
            <span>Now enrolling:</span>
            <span
              key={wordIndex}
              className="font-display font-bold text-sky-700 cz-word-fade"
            >
              {PROGRAMS[wordIndex].name}
            </span>
          </div>

          <div className="mt-[34px] flex flex-wrap gap-4 cz-fade-in-up [animation-delay:0.24s]">
            <Link
              href="/programs"
              className="rounded-lg bg-sky-400 px-7 py-4 text-base font-bold whitespace-nowrap text-slate-900 transition-transform duration-150 hover:scale-105 cz-pulse-glow"
            >
              See programs
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border-2 border-gray-900 bg-white px-7 py-3.5 text-base font-bold whitespace-nowrap text-gray-900 transition-transform duration-150 hover:scale-105"
            >
              Contact us
            </Link>
          </div>

          <div className="mt-9 flex max-w-[46ch] items-start gap-3 rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3.5 cz-fade-in-up [animation-delay:0.32s]">
            <TrendingUp
              className="mt-0.5 h-5 w-5 shrink-0 text-sky-600"
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="text-sm leading-relaxed text-slate-700">
              <strong className="font-semibold">
                {EXTERNAL_STAT.headline}
              </strong>
              <span className="mt-1 block text-xs opacity-60">
                External industry benchmark — {EXTERNAL_STAT.source}, not a
                CareerZeta guarantee.
              </span>
            </span>
          </div>
        </div>

        <div className="rounded-[20px] bg-gradient-to-br from-gray-900 via-sky-400 to-gray-900 p-1.5 cz-gradient-drift">
          <MediaPlaceholder
            icon={ImageIcon}
            label="Hero visual — custom illustration to be supplied"
            className="h-[420px] w-full rounded-2xl"
          />
        </div>
      </div>

      <div className="relative z-10 mt-14 overflow-hidden rounded-full border border-slate-200 bg-white/50 py-3 backdrop-blur-sm">
        <div className="flex whitespace-nowrap cz-marquee">
          <span className="pr-16 text-sm font-semibold text-slate-500">
            {strip}
          </span>
          <span className="pr-16 text-sm font-semibold text-slate-500">
            {strip}
          </span>
        </div>
      </div>
    </section>
  );
}
