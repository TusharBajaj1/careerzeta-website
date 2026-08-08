import Link from "next/link";
import {
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  FileText,
  Gauge,
} from "lucide-react";

import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
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

  return (
    <Reveal
      id={program.slug}
      className={`relative scroll-mt-24 overflow-hidden px-6 py-16 md:px-10 lg:px-16 lg:py-20 ${
        index % 2 === 0 ? "bg-white" : "bg-slate-50"
      }`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute top-0 font-display text-[280px] leading-none font-bold text-slate-900 opacity-[0.03] select-none lg:text-[420px] ${
          imageOnRight ? "-right-10" : "-left-10"
        }`}
      >
        {detail.number}
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        <div
          className={`cz-program-grid gap-x-10 gap-y-8 ${
            imageOnRight ? "cz-image-right" : "cz-image-left"
          }`}
        >
          <div className="cz-area-top">
            <div className="flex items-center gap-3">
              <span className="font-display text-lg font-bold text-sky-500">
                {detail.number}
              </span>
              <span className="h-px w-8 bg-sky-300" aria-hidden />
              <Icon
                className="h-6 w-6 text-sky-400"
                strokeWidth={1.5}
                aria-hidden
              />
            </div>

            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              {program.name}
            </h2>

            <p className="mt-4 font-display text-xl font-bold text-sky-600 md:text-2xl">
              {detail.question}
            </p>

            <p className="mt-4 max-w-[60ch] text-base leading-relaxed opacity-75">
              {detail.context}
            </p>

            <div className="mt-6">
              <p className="font-semibold">
                Choose our{" "}
                <span className="text-sky-600">{program.name} Course</span>{" "}
                to:
              </p>
              <StaggerGroup as="ul" className="mt-3 flex flex-col gap-2.5">
                {detail.reasons.map((reason) => (
                  <StaggerItem
                    key={reason}
                    as="li"
                    className="flex items-start gap-2.5"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-sky-500"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <span className="text-[15px] leading-relaxed opacity-80">
                      {reason}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </div>

          <div className="cz-area-levelprereq flex flex-col gap-5 lg:pt-1">
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100">
                <Gauge
                  className="h-5 w-5 text-sky-600"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </span>
              <div>
                <div className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
                  Level
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-display font-bold">
                    {detail.level}
                  </span>
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
              </div>
            </div>

            <div className="border-t border-line pt-5">
              <div className="flex items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100">
                  <Bookmark
                    className="h-5 w-5 text-sky-600"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </span>
                <div>
                  <div className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
                    Prerequisites
                  </div>
                  <div className="mt-1 text-sm font-semibold">
                    {detail.prerequisites}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cz-area-image">
            <MediaPlaceholder
              icon={Icon}
              label={`${program.name} — program photography to be supplied`}
              className="h-[300px] w-full rounded-2xl lg:h-full lg:min-h-[420px]"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-10 border-t border-line pt-10 md:grid-cols-3 md:gap-6">
          <div className="md:pr-6">
            <p className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
              What You&apos;ll Do
            </p>
            <StaggerGroup className="mt-4 flex flex-wrap items-start gap-x-1 gap-y-4">
              {detail.whatYoullDo.map((step, i) => {
                const StepIcon =
                  WHAT_YOULL_DO_ICONS[i % WHAT_YOULL_DO_ICONS.length];
                return (
                  <StaggerItem key={step} className="flex items-start gap-1">
                    {i > 0 && (
                      <ChevronRight
                        className="mt-3.5 h-4 w-4 shrink-0 opacity-30"
                        aria-hidden
                      />
                    )}
                    <div className="flex w-20 flex-col items-center gap-2 text-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 transition-transform duration-200 hover:scale-110">
                        <StepIcon
                          className="h-4.5 w-4.5 text-gray-900"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </span>
                      <span className="text-xs leading-snug font-semibold">
                        {step}
                      </span>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </div>

          <div className="border-t border-line pt-8 md:border-t-0 md:border-l md:px-6 md:pt-0">
            <p className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
              Core Tools
            </p>
            {detail.tools.length > 0 ? (
              <>
                <StaggerGroup className="mt-4 flex flex-wrap gap-x-6 gap-y-4">
                  {detail.tools.map((tool) => {
                    const { icon: ToolIcon, color } = toolMeta(tool);
                    return (
                      <StaggerItem
                        key={tool}
                        className="flex w-16 flex-col items-center gap-2 text-center"
                      >
                        <span
                          className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
                          style={{ backgroundColor: `${color}1a` }}
                        >
                          <ToolIcon
                            className="h-5 w-5"
                            style={{ color }}
                            aria-hidden
                          />
                        </span>
                        <span className="text-xs font-semibold">{tool}</span>
                      </StaggerItem>
                    );
                  })}
                </StaggerGroup>
                {detail.toolsNote && (
                  <p className="mt-3 text-xs opacity-50 italic">
                    {detail.toolsNote}
                  </p>
                )}
              </>
            ) : (
              <p className="mt-3 text-sm opacity-60 italic">
                {detail.toolsNote}
              </p>
            )}
          </div>

          <div className="border-t border-line pt-8 md:border-t-0 md:border-l md:pl-6 md:pt-0">
            <p className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
              Roles You Can Aim For
            </p>
            <StaggerGroup className="mt-4 grid grid-cols-2 gap-2.5">
              {detail.roles.map((role) => (
                <StaggerItem
                  key={role}
                  className="rounded-xl bg-sky-50 px-3 py-2 text-center text-[13px] font-semibold text-sky-700"
                >
                  {role}
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {detail.brochureUrl ? (
            <a
              href={detail.brochureUrl}
              className="flex items-center gap-2 rounded-lg border-2 border-sky-300 bg-white px-6 py-3 text-sm font-bold whitespace-nowrap text-sky-700 transition-transform duration-150 hover:scale-105"
            >
              <FileText className="h-4 w-4" aria-hidden />
              Program Brochure
            </a>
          ) : (
            <span
              className="flex cursor-not-allowed items-center gap-2 rounded-lg border-2 border-line px-6 py-3 text-sm font-bold whitespace-nowrap text-slate-400"
              title="Brochure not yet available"
            >
              <FileText className="h-4 w-4" aria-hidden />
              Program Brochure — coming soon
            </span>
          )}
          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-lg bg-sky-400 px-6 py-3 text-sm font-bold whitespace-nowrap text-slate-900 transition-transform duration-150 hover:scale-105"
          >
            Get Admission
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
