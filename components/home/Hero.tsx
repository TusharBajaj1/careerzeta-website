import Link from "next/link";

import Reveal from "@/components/ui/Reveal";
import { EXTERNAL_STAT } from "@/lib/content";

export default function Hero() {
  return (
    <Reveal
      id="home"
      className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 pt-12 pb-16 md:grid-cols-2 md:px-10 lg:px-16"
    >
      <div>
        <span className="inline-block rounded-[20px] bg-sky-100 px-4 py-2 text-sm font-bold text-sky-700">
          Online courses &amp; mentorship
        </span>

        <h1 className="mt-5 font-display text-5xl leading-[1.05] font-bold text-balance lg:text-[60px]">
          Stop waiting. Start building your future.
        </h1>

        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed opacity-75">
          Technology has changed faster than anything since the personal
          computer. CareerZeta pairs learners with qualified mentors so
          professionals keep moving with it, not behind it.
        </p>

        <div className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-sky-100 px-[18px] py-[9px] text-sm">
          <span className="cz-dot-pulse h-2.5 w-2.5 rounded-full bg-sky-400" />
          Now enrolling: <b>All programs</b>
        </div>

        <div className="mt-7 flex flex-wrap gap-3.5">
          <Link
            href="/programs"
            className="cz-pulse-glow rounded-lg bg-sky-400 px-7 py-4 font-bold text-gray-900 transition-transform duration-150 hover:scale-105"
          >
            See programs
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border-2 border-gray-900 px-[26px] py-3.5 font-bold text-gray-900 transition-transform duration-150 hover:scale-105"
          >
            Contact us
          </Link>
        </div>

        <div className="mt-9 max-w-[52ch] border-t border-line pt-6">
          <div className="font-display text-xl font-bold">
            {EXTERNAL_STAT.headline}
          </div>
          <div className="mt-1 text-sm opacity-50">
            — {EXTERNAL_STAT.source}
          </div>
        </div>
      </div>

      {/* Rotating rings: mentor at the centre, learners in orbit. Ambient spin. */}
      <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[20px] bg-gray-900">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1.5px 1.5px, #e2e8f0 1.5px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <circle cx="200" cy="200" r="70" fill="none" stroke="#38bdf8" strokeOpacity=".5" strokeWidth="2" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="#38bdf8" strokeOpacity=".35" strokeWidth="2" strokeDasharray="4 8" />
          <circle cx="200" cy="200" r="170" fill="none" stroke="#38bdf8" strokeOpacity=".2" strokeWidth="2" />
          <g
            className="animate-[cz-spin_40s_linear_infinite]"
            style={{ transformOrigin: "200px 200px" }}
          >
            <circle cx="270" cy="200" r="11" fill="#7dd3fc" />
            <circle cx="130" cy="200" r="8" fill="#e0f2fe" />
          </g>
          <g
            className="animate-[cz-spin_60s_linear_infinite_reverse]"
            style={{ transformOrigin: "200px 200px" }}
          >
            <circle cx="200" cy="80" r="13" fill="#38bdf8" />
            <circle cx="304" cy="260" r="9" fill="#7dd3fc" />
            <circle cx="96" cy="260" r="9" fill="#e0f2fe" />
          </g>
          <g
            className="animate-[cz-spin_90s_linear_infinite]"
            style={{ transformOrigin: "200px 200px" }}
          >
            <circle cx="200" cy="30" r="8" fill="#e0f2fe" />
            <circle cx="340" cy="290" r="10" fill="#38bdf8" />
          </g>
          <circle cx="200" cy="200" r="34" fill="#38bdf8" />
          <path
            d="M186 208 l14 -20 l14 20 M200 188 v30"
            fill="none"
            stroke="#111827"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Reveal>
  );
}
