import Link from "next/link";
import { ArrowRight, CheckCircle2, Download } from "lucide-react";

import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import type { Program } from "@/lib/content";
import { toolIcon, type ProgramDetail } from "@/lib/programsDetail";

type ProgramSectionProps = {
  program: Program;
  detail: ProgramDetail;
  index: number;
};

export default function ProgramSection({
  program,
  detail,
  index,
}: ProgramSectionProps) {
  const imageOnRight = index % 2 === 0;
  const Icon = program.icon;

  return (
    <section
      id={program.slug}
      className={`scroll-mt-24 px-6 py-20 md:px-10 lg:px-16 lg:py-24 ${
        index % 2 === 0 ? "bg-white" : "bg-slate-50"
      }`}
    >
      <div
        className={`cz-program-grid mx-auto max-w-[1400px] gap-x-14 gap-y-10 ${
          imageOnRight ? "cz-image-right" : "cz-image-left"
        }`}
      >
        <div className="cz-area-top">
          <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
            Program {detail.number}
          </h6>
          <div className="mt-3 flex items-center gap-3">
            <Icon
              className="h-8 w-8 shrink-0 text-sky-400"
              strokeWidth={1.5}
              aria-hidden
            />
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              {program.name}
            </h2>
          </div>

          <p className="mt-5 font-display text-xl font-bold md:text-2xl">
            {detail.question}
          </p>

          <p className="mt-4 max-w-[60ch] text-base leading-relaxed opacity-75">
            {detail.context}
          </p>

          <div className="mt-6">
            <p className="font-semibold">
              Choose our {program.name} Course to:
            </p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {detail.reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-sky-500"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span className="text-[15px] leading-relaxed opacity-80">
                    {reason}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-6 border-y border-line py-5">
            <div>
              <div className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
                Level
              </div>
              <div className="mt-1.5 font-display font-bold">
                {detail.level}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
                Prerequisites
              </div>
              <div className="mt-1.5 text-sm font-semibold">
                {detail.prerequisites}
              </div>
            </div>
          </div>
        </div>

        <div className="cz-area-image">
          <MediaPlaceholder
            icon={Icon}
            label={`${program.name} — program photography to be supplied`}
            className="h-[360px] w-full rounded-2xl lg:h-full lg:min-h-[500px]"
          />
        </div>

        <div className="cz-area-bottom">
          <div>
            <p className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
              What You&apos;ll Do
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
              {detail.whatYoullDo.map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold">{step}</span>
                  {i < detail.whatYoullDo.length - 1 && (
                    <ArrowRight
                      className="h-4 w-4 text-sky-400"
                      strokeWidth={2}
                      aria-hidden
                    />
                  )}
                </span>
              ))}
            </div>
          </div>

          {detail.tools.length > 0 && (
            <div className="mt-7">
              <p className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
                Core Tools
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {detail.tools.map((tool) => {
                  const ToolIcon = toolIcon(tool);
                  return (
                    <span
                      key={tool}
                      className="flex items-center gap-1.5 rounded-2xl bg-sky-100 px-3.5 py-1.5 text-[13px] font-semibold text-sky-700"
                    >
                      <ToolIcon className="h-3.5 w-3.5" aria-hidden />
                      {tool}
                    </span>
                  );
                })}
              </div>
              {detail.toolsNote && (
                <p className="mt-2 text-xs opacity-50 italic">
                  {detail.toolsNote}
                </p>
              )}
            </div>
          )}

          {detail.tools.length === 0 && detail.toolsNote && (
            <div className="mt-7">
              <p className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
                Core Tools
              </p>
              <p className="mt-2 text-sm opacity-60 italic">
                {detail.toolsNote}
              </p>
            </div>
          )}

          <div className="mt-7">
            <p className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
              Roles You Can Aim For
            </p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {detail.roles.map((role) => (
                <span
                  key={role}
                  className="rounded-2xl bg-slate-200 px-3.5 py-1.5 text-[13px] font-semibold text-gray-900"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            {detail.brochureUrl ? (
              <a
                href={detail.brochureUrl}
                className="flex items-center gap-2 rounded-lg border-2 border-gray-900 bg-white px-6 py-3 text-sm font-bold whitespace-nowrap text-gray-900 transition-transform duration-150 hover:scale-105"
              >
                <Download className="h-4 w-4" aria-hidden />
                Program Brochure
              </a>
            ) : (
              <span
                className="flex cursor-not-allowed items-center gap-2 rounded-lg border-2 border-line px-6 py-3 text-sm font-bold whitespace-nowrap text-slate-400"
                title="Brochure not yet available"
              >
                <Download className="h-4 w-4" aria-hidden />
                Program Brochure — coming soon
              </span>
            )}
            <Link
              href="/contact"
              className="rounded-lg bg-sky-400 px-6 py-3 text-sm font-bold whitespace-nowrap text-slate-900 transition-transform duration-150 hover:scale-105"
            >
              Get Admission
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
