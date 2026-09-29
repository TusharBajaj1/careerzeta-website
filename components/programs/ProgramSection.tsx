import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import type { Program } from "@/lib/content";
import type { ProgramDetail } from "@/lib/programsDetail";

type ProgramSectionProps = {
  program: Program;
  detail: ProgramDetail;
  index: number;
};

/**
 * Geometric stand-ins for photography that hasn't been shot yet, drawn on
 * the charcoal visual panel. Delete this map and the motif div once real
 * photos exist.
 */
const grow = (delay: number): CSSProperties => ({
  transformBox: "fill-box",
  transformOrigin: "bottom",
  animation: `cz-grow 1s ${delay}s ease-out both`,
});

const MOTIFS: Record<string, ReactNode> = {
  "data-analytics": (
    <svg viewBox="0 0 300 180" className="h-full w-full" aria-hidden="true">
      <rect x="30" y="90" width="34" height="70" rx="7" fill="#7dd3fc" style={grow(0)} />
      <rect x="82" y="55" width="34" height="105" rx="7" fill="#38bdf8" style={grow(0.1)} />
      <rect x="134" y="100" width="34" height="60" rx="7" fill="#7dd3fc" style={grow(0.2)} />
      <rect x="186" y="30" width="34" height="130" rx="7" fill="#e0f2fe" style={grow(0.3)} />
      <rect x="238" y="70" width="34" height="90" rx="7" fill="#38bdf8" style={grow(0.4)} />
      <line x1="15" y1="162" x2="285" y2="162" stroke="#e2e8f0" strokeOpacity=".4" strokeWidth="2" />
    </svg>
  ),
  "business-analytics": (
    <svg viewBox="0 0 300 180" className="h-full w-full" aria-hidden="true">
      <polyline
        points="25,140 90,108 150,120 215,58 275,32"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="8 8"
        className="cz-dash"
      />
      <circle cx="25" cy="140" r="8" fill="#7dd3fc" />
      <circle cx="90" cy="108" r="8" fill="#7dd3fc" />
      <circle cx="150" cy="120" r="8" fill="#7dd3fc" />
      <circle cx="215" cy="58" r="8" fill="#7dd3fc" />
      <circle cx="275" cy="32" r="12" fill="#e0f2fe" />
    </svg>
  ),
  "data-science": (
    <svg viewBox="0 0 300 180" className="h-full w-full" aria-hidden="true">
      <circle cx="118" cy="98" r="58" fill="#38bdf8" fillOpacity=".55" />
      <circle cx="184" cy="98" r="58" fill="#7dd3fc" fillOpacity=".45" />
      <circle cx="151" cy="55" r="58" fill="#e0f2fe" fillOpacity=".4" />
    </svg>
  ),
  "applied-ai": (
    <svg viewBox="0 0 300 180" className="h-full w-full" aria-hidden="true">
      <g stroke="#7dd3fc" strokeOpacity=".5" strokeWidth="2">
        <line x1="150" y1="90" x2="70" y2="45" />
        <line x1="150" y1="90" x2="235" y2="135" />
        <line x1="150" y1="90" x2="60" y2="135" />
        <line x1="150" y1="90" x2="240" y2="50" />
        <line x1="150" y1="90" x2="150" y2="25" />
        <line x1="150" y1="90" x2="150" y2="158" />
      </g>
      <circle cx="150" cy="90" r="30" fill="#38bdf8" />
      <circle cx="150" cy="90" r="42" fill="none" stroke="#38bdf8" strokeOpacity=".4" className="cz-pulse" />
      <circle cx="70" cy="45" r="10" fill="#7dd3fc" />
      <circle cx="235" cy="135" r="10" fill="#7dd3fc" />
      <circle cx="60" cy="135" r="7" fill="#e0f2fe" />
      <circle cx="240" cy="50" r="7" fill="#e0f2fe" />
      <circle cx="150" cy="25" r="6" fill="#e0f2fe" />
      <circle cx="150" cy="158" r="6" fill="#e0f2fe" />
    </svg>
  ),
  "agentic-ai": (
    <svg viewBox="0 0 300 180" className="h-full w-full" aria-hidden="true">
      <g stroke="#7dd3fc" strokeWidth="4" strokeDasharray="6 6" className="cz-dash">
        <line x1="55" y1="55" x2="150" y2="90" />
        <line x1="150" y1="90" x2="245" y2="45" />
        <line x1="150" y1="90" x2="150" y2="150" />
        <line x1="150" y1="150" x2="235" y2="140" />
      </g>
      <circle cx="55" cy="55" r="13" fill="#7dd3fc" />
      <circle cx="150" cy="90" r="19" fill="#38bdf8" />
      <circle cx="245" cy="45" r="13" fill="#e0f2fe" />
      <circle cx="150" cy="150" r="13" fill="#e0f2fe" />
      <circle cx="235" cy="140" r="10" fill="#7dd3fc" />
    </svg>
  ),
  "machine-learning": (
    <svg viewBox="0 0 300 180" className="h-full w-full" aria-hidden="true">
      <line x1="25" y1="155" x2="280" y2="35" stroke="#38bdf8" strokeWidth="3" strokeDasharray="3 9" strokeLinecap="round" />
      <circle cx="45" cy="128" r="8" fill="#7dd3fc" />
      <circle cx="85" cy="148" r="8" fill="#e0f2fe" />
      <circle cx="125" cy="98" r="8" fill="#7dd3fc" />
      <circle cx="165" cy="115" r="8" fill="#e0f2fe" />
      <circle cx="205" cy="72" r="8" fill="#7dd3fc" />
      <circle cx="250" cy="52" r="11" fill="#38bdf8" className="cz-pulse" />
    </svg>
  ),
};

const eyebrow = "text-xs font-bold tracking-[0.06em] text-sky-700 uppercase";

const LEVEL_METER: Record<ProgramDetail["level"], number> = {
  Beginner: 1,
  Intermediate: 2,
  Professional: 3,
};

export default function ProgramSection({
  program,
  detail,
  index,
}: ProgramSectionProps) {
  const number = String(index + 1).padStart(2, "0");
  const flip = index % 2 === 1;
  const levelFilled = LEVEL_METER[detail.level];

  const textCol = (
    <div>
      <div className="font-display text-6xl leading-none font-bold text-sky-400 lg:text-[96px]">
        {number}
      </div>

      <h2 className="mt-2 font-display text-4xl leading-[1.15] font-bold lg:text-[44px]">
        {program.name}
      </h2>

      <p className="mt-3.5 font-display text-xl leading-snug font-bold text-sky-700">
        {detail.question}
      </p>

      <p className="mt-4 max-w-[56ch] text-base leading-relaxed opacity-75">
        {detail.context}
      </p>

      <StaggerGroup className="mt-7 flex flex-wrap items-center gap-2.5">
        {detail.tools.length > 0 ? (
          detail.tools.map((tool) => (
            <StaggerItem
              key={tool}
              className="rounded-full bg-gray-900 px-[18px] py-2.5 text-[15px] font-bold text-white"
            >
              {tool}
            </StaggerItem>
          ))
        ) : (
          <span className="text-sm italic opacity-50">{detail.toolsNote}</span>
        )}
      </StaggerGroup>

      <StaggerGroup as="ul" className="mt-7 flex flex-col gap-3">
        {detail.reasons.slice(0, 3).map((reason) => (
          <StaggerItem
            key={reason}
            as="li"
            className="flex items-start gap-3 text-[15px] leading-relaxed"
          >
            <span className="mt-[7px] h-2.5 w-2.5 shrink-0 rounded-full bg-sky-400" />
            {reason}
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="mt-9 flex flex-wrap items-center gap-3.5">
        <Link
          href="/contact"
          className="rounded-lg bg-sky-400 px-[26px] py-[15px] text-[15px] font-bold text-gray-900 transition-transform duration-150 hover:scale-105"
        >
          Get Admission
        </Link>
        {detail.brochureUrl ? (
          <a
            href={detail.brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border-2 border-gray-900 px-6 py-[13px] text-[15px] font-bold text-gray-900 transition-transform duration-150 hover:scale-105"
          >
            Download Brochure
          </a>
        ) : (
          <span
            className="cursor-not-allowed text-sm font-bold opacity-50"
            title="Brochure not yet available"
          >
            Brochure — coming soon
          </span>
        )}
      </div>
    </div>
  );

  const imageCol = (
    <div className="relative overflow-hidden rounded-2xl bg-gray-900 px-7 pt-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1.5px 1.5px, #e2e8f0 1.5px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="cz-drift relative h-[220px] lg:h-[260px]">
        {MOTIFS[program.slug]}
      </div>

      <div className="relative mt-2 flex flex-col gap-4 rounded-t-2xl bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className={eyebrow}>Level</div>
            <div className="mt-0.5 font-display text-xl font-bold">
              {detail.level}
            </div>
          </div>
          {detail.duration && (
            <div>
              <div className={eyebrow}>Duration</div>
              <div className="mt-0.5 font-display text-xl font-bold">
                {detail.duration}
              </div>
            </div>
          )}
          <div className="flex gap-1.5" aria-hidden>
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={`h-2 w-7 rounded ${
                  n <= levelFilled ? "bg-sky-400" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-line pt-4">
          <div className={eyebrow}>Prerequisites</div>
          <div className="mt-0.5 text-sm leading-relaxed">
            {detail.prerequisites}
          </div>
        </div>

        <div className="border-t border-line pt-4">
          <div className={eyebrow}>Roles you can aim for</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {detail.roles.slice(0, 4).map((role) => (
              <span
                key={role}
                className="rounded-full bg-sky-100 px-3.5 py-[7px] text-sm font-bold text-sky-700"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Reveal
      id={program.slug}
      className={`relative scroll-mt-[165px] px-6 py-14 md:px-10 lg:px-16 lg:py-16 ${
        flip ? "bg-slate-100" : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-[1400px]">
        {/*
         * Text always precedes the visual panel in source order (title ->
         * question -> description -> tools -> reasons -> CTAs -> panel),
         * which is also the required mobile reading order. Desktop-only
         * `order` classes swap the visual position for odd-indexed programs
         * without touching DOM/tab order or mobile stacking.
         */}
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className={flip ? "md:order-2" : ""}>{textCol}</div>
          <div className={flip ? "md:order-1" : ""}>{imageCol}</div>
        </div>

        {/* Journey: numbered nodes on a connecting line, last node accented. */}
        <div className="mt-14">
          <div className={`${eyebrow} mb-6`}>What you&apos;ll do</div>
          <ol className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
            {detail.whatYoullDo.map((step, i) => {
              const last = i === detail.whatYoullDo.length - 1;
              return (
                <li key={step} className="flex flex-col gap-3.5">
                  <div className="flex items-center">
                    <span
                      className={`flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full text-sm font-bold ${
                        last ? "bg-sky-400 text-gray-900" : "bg-gray-900 text-white"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`h-[3px] flex-1 rounded-sm ${
                        last ? "bg-transparent" : "bg-slate-300"
                      }`}
                    />
                  </div>
                  <div className="pr-2 text-[15px] leading-snug font-bold">
                    {step}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Reveal>
  );
}
