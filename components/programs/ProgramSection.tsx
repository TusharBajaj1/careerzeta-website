import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Bookmark,
  Briefcase,
  ChevronRight,
  Download,
  FileText,
  Gauge,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import type { Program } from "@/lib/content";
import {
  toolMeta,
  WHAT_YOULL_DO_ICONS,
  type ProgramDetail,
} from "@/lib/programsDetail";

type ProgramSectionProps = {
  program: Program;
  detail: ProgramDetail;
  index: number;
};

/**
 * Abstract, brand-colored stand-ins for photography that hasn't been shot
 * yet — geometric shapes only (bars, dots, lines), not illustration. Delete
 * this map and the <div className="motif">...</div> block once real photos
 * exist.
 */
const MOTIFS: Record<string, ReactNode> = {
  "data-analytics": (
    <svg viewBox="0 0 300 180" className="h-full w-full">
      <rect x="40" y="90" width="30" height="60" rx="6" fill="#7dd3fc" />
      <rect x="90" y="60" width="30" height="90" rx="6" fill="#38bdf8" />
      <rect x="140" y="100" width="30" height="50" rx="6" fill="#7dd3fc" />
      <rect x="190" y="40" width="30" height="110" rx="6" fill="#0284c7" />
      <rect x="240" y="75" width="30" height="75" rx="6" fill="#38bdf8" />
    </svg>
  ),
  "business-analytics": (
    <svg viewBox="0 0 300 180" className="h-full w-full">
      <polyline
        points="30,140 90,110 150,120 210,60 270,40"
        fill="none"
        stroke="#0284c7"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="140" r="7" fill="#38bdf8" />
      <circle cx="90" cy="110" r="7" fill="#38bdf8" />
      <circle cx="150" cy="120" r="7" fill="#38bdf8" />
      <circle cx="210" cy="60" r="7" fill="#38bdf8" />
      <circle cx="270" cy="40" r="9" fill="#0369a1" />
    </svg>
  ),
  "applied-ai": (
    <svg viewBox="0 0 300 180" className="h-full w-full">
      <circle cx="150" cy="90" r="26" fill="#38bdf8" opacity="0.9" />
      <circle cx="80" cy="50" r="10" fill="#7dd3fc" />
      <circle cx="220" cy="130" r="10" fill="#7dd3fc" />
      <circle cx="60" cy="130" r="7" fill="#0284c7" />
      <circle cx="235" cy="55" r="7" fill="#0284c7" />
      <circle cx="150" cy="30" r="6" fill="#0369a1" />
      <circle cx="150" cy="150" r="6" fill="#0369a1" />
    </svg>
  ),
  "agentic-ai": (
    <svg viewBox="0 0 300 180" className="h-full w-full">
      <line x1="60" y1="60" x2="150" y2="90" stroke="#7dd3fc" strokeWidth="4" />
      <line x1="150" y1="90" x2="240" y2="50" stroke="#7dd3fc" strokeWidth="4" />
      <line x1="150" y1="90" x2="150" y2="150" stroke="#7dd3fc" strokeWidth="4" />
      <line x1="150" y1="150" x2="230" y2="140" stroke="#7dd3fc" strokeWidth="4" />
      <circle cx="60" cy="60" r="12" fill="#0284c7" />
      <circle cx="150" cy="90" r="16" fill="#0369a1" />
      <circle cx="240" cy="50" r="12" fill="#38bdf8" />
      <circle cx="150" cy="150" r="12" fill="#38bdf8" />
      <circle cx="230" cy="140" r="10" fill="#7dd3fc" />
    </svg>
  ),
  "machine-learning": (
    <svg viewBox="0 0 300 180" className="h-full w-full">
      <line
        x1="30"
        y1="150"
        x2="270"
        y2="40"
        stroke="#0284c7"
        strokeWidth="3"
        strokeDasharray="2 8"
        strokeLinecap="round"
      />
      <circle cx="50" cy="130" r="7" fill="#38bdf8" />
      <circle cx="90" cy="140" r="7" fill="#7dd3fc" />
      <circle cx="130" cy="95" r="7" fill="#38bdf8" />
      <circle cx="170" cy="105" r="7" fill="#7dd3fc" />
      <circle cx="210" cy="70" r="7" fill="#38bdf8" />
      <circle cx="250" cy="55" r="7" fill="#0369a1" />
    </svg>
  ),
  "data-science": (
    <svg viewBox="0 0 300 180" className="h-full w-full">
      <circle cx="120" cy="90" r="55" fill="#38bdf8" opacity="0.55" />
      <circle cx="180" cy="90" r="55" fill="#0284c7" opacity="0.55" />
      <circle cx="150" cy="50" r="55" fill="#7dd3fc" opacity="0.5" />
    </svg>
  ),
};

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
  const imageOnRight = index % 2 === 0;
  const Icon = program.icon;
  const levelFilled = LEVEL_METER[detail.level];

  const textCol = (
    <div>
      <div className="flex items-center gap-3">
        <span className="font-display text-lg font-bold text-sky-500">
          {detail.number}
        </span>
        <span className="h-px w-8 bg-sky-300" aria-hidden />
        <Icon className="h-6 w-6 text-sky-400" strokeWidth={1.5} aria-hidden />
      </div>

      <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
        {program.name}
      </h2>

      <p className="mt-3 font-display text-xl font-bold text-sky-600">
        {detail.question}
      </p>

      <p className="mt-4 max-w-[56ch] text-base leading-relaxed opacity-75">
        {detail.context}
      </p>

      <StaggerGroup className="mt-6 flex flex-wrap items-center gap-2.5">
        {detail.tools.length > 0 ? (
          detail.tools.map((tool) => {
            const { icon: ToolIcon, color } = toolMeta(tool);
            return (
              <StaggerItem
                key={tool}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-base font-bold"
                style={{
                  background: `${color}14`,
                  borderColor: `${color}40`,
                  color,
                }}
              >
                <ToolIcon className="h-5 w-5" aria-hidden />
                {tool}
              </StaggerItem>
            );
          })
        ) : (
          <span className="text-sm italic opacity-50">{detail.toolsNote}</span>
        )}
      </StaggerGroup>

      <div className="mt-6">
        <StaggerGroup as="ul" className="flex flex-col gap-2">
          {detail.reasons.slice(0, 3).map((reason) => (
            <StaggerItem
              key={reason}
              as="li"
              className="flex items-start gap-2.5"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                <ArrowUpRight
                  className="h-3 w-3 rotate-45"
                  strokeWidth={3}
                  aria-hidden
                />
              </span>
              <span className="text-[15px] leading-relaxed opacity-80">
                {reason}
              </span>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Link
          href="/contact"
          className="flex items-center gap-2 rounded-lg bg-sky-400 px-6 py-3 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105"
        >
          Get Admission
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
        {detail.brochureUrl ? (
          <a
            href={detail.brochureUrl}
            className="flex items-center gap-2 rounded-lg border-2 border-sky-300 px-6 py-3 text-sm font-bold text-sky-700 transition-transform duration-150 hover:scale-105"
          >
            Download Brochure
            <Download className="h-4 w-4" aria-hidden />
          </a>
        ) : (
          <span
            className="flex cursor-not-allowed items-center gap-2 rounded-lg border-2 border-line px-6 py-3 text-sm font-bold text-slate-400"
            title="Brochure not yet available"
          >
            <FileText className="h-4 w-4" aria-hidden />
            Brochure — coming soon
          </span>
        )}
      </div>
    </div>
  );

  const imageCol = (
    <div className="relative flex h-[420px] flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 to-slate-100 lg:h-full lg:min-h-[440px]">
      <div className="relative min-h-[160px] flex-1 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1.5px 1.5px, rgb(203 213 225) 1.5px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="absolute inset-6">{MOTIFS[program.slug]}</div>
        <span className="absolute top-4 left-6 text-xs font-semibold text-slate-400">
          Concept graphic — real photography to follow
        </span>
      </div>

      <div className="relative border-t border-line bg-white/90 p-5 backdrop-blur">
        <div className="flex items-center gap-2">
          <Gauge
            className="h-4 w-4 text-sky-600"
            strokeWidth={1.75}
            aria-hidden
          />
          <span className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
            Level
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-display font-bold">{detail.level}</span>
          <span className="flex gap-1" aria-hidden>
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={`h-1.5 w-4 rounded-full ${
                  n <= levelFilled ? "bg-sky-400" : "bg-line"
                }`}
              />
            ))}
          </span>
        </div>

        <div className="mt-3 border-t border-line pt-3">
          <div className="flex items-center gap-2">
            <Bookmark
              className="h-4 w-4 text-sky-600"
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
              Prerequisites
            </span>
          </div>
          <div className="mt-1 text-sm font-semibold">
            {detail.prerequisites}
          </div>
        </div>

        <div className="mt-3 border-t border-line pt-3">
          <div className="flex items-center gap-2">
            <Briefcase
              className="h-4 w-4 text-sky-600"
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
              Roles you can aim for
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {detail.roles.slice(0, 4).map((role) => (
              <span
                key={role}
                className="rounded-full bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700"
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
      className={`relative scroll-mt-24 px-6 py-14 md:px-10 lg:px-16 lg:py-16 ${
        index % 2 === 0 ? "bg-white" : "bg-slate-50"
      }`}
    >
      <div className="mx-auto max-w-[1200px]">
        {/*
         * Text always precedes image in source order (title -> question ->
         * description -> tools -> reasons -> CTAs -> image+quick-facts),
         * which is also the required mobile reading order. Desktop-only
         * `order` classes swap the visual position for odd-indexed
         * programs without touching DOM/tab order or mobile stacking.
         */}
        <div className="grid items-stretch gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div className={imageOnRight ? "" : "lg:order-2"}>{textCol}</div>
          <div className={imageOnRight ? "" : "lg:order-1"}>{imageCol}</div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-line pt-6">
          <span className="mr-1 text-xs font-bold tracking-[0.06em] uppercase opacity-40">
            What you&apos;ll do
          </span>
          <StaggerGroup className="flex flex-wrap items-center gap-2">
            {detail.whatYoullDo.map((step, i) => {
              const StepIcon =
                WHAT_YOULL_DO_ICONS[i % WHAT_YOULL_DO_ICONS.length];
              return (
                <StaggerItem key={step} className="flex items-center gap-2">
                  {i > 0 && (
                    <ChevronRight
                      className="h-3.5 w-3.5 opacity-30"
                      aria-hidden
                    />
                  )}
                  <StepIcon className="h-3.5 w-3.5 opacity-50" aria-hidden />
                  <span className="text-xs font-semibold text-slate-700">
                    {step}
                  </span>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </div>
    </Reveal>
  );
}
