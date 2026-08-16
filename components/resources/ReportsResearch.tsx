import { ArrowUpRight, FileText } from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import { REPORTS } from "@/lib/resourcesContent";

export default function ReportsResearch() {
  const featured = REPORTS.find((r) => r.featured);
  const rest = REPORTS.filter((r) => !r.featured);

  return (
    <Reveal
      id="reports"
      className="scroll-mt-24 bg-slate-50 px-6 py-16 md:px-10 lg:px-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Reports &amp; research
        </h6>
        <h2 className="mt-3.5 max-w-[32ch] font-display text-4xl font-bold">
          Why the skills you&apos;re considering actually matter
        </h2>

        {featured && (
          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-11 flex flex-col overflow-hidden rounded-2xl border-2 border-sky-300 bg-white transition hover:border-sky-400 md:flex-row md:items-stretch"
          >
            <MediaPlaceholder
              icon={FileText}
              label="Report cover — added periodically"
              className="min-h-[220px] shrink-0 md:w-[340px]"
            />
            <div className="flex flex-1 flex-col justify-center gap-3 p-8 lg:p-11">
              <span className="text-xs font-bold tracking-[0.06em] text-sky-700 uppercase">
                Featured · {featured.organisation} · {featured.year}
              </span>
              <h3 className="font-display text-2xl font-bold md:text-[28px]">
                {featured.title}
              </h3>
              <p className="max-w-[65ch] text-base leading-relaxed opacity-75">
                {featured.description}
              </p>
              <span className="mt-2 flex w-fit shrink-0 items-center gap-2 rounded-lg bg-sky-400 px-6 py-3 text-sm font-bold whitespace-nowrap text-slate-900 transition-transform duration-150 group-hover:scale-105">
                Read
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </a>
        )}

        <StaggerGroup className="mt-8 grid gap-6 sm:grid-cols-2">
          {rest.map((report) => (
            <StaggerItem key={report.title}>
              <a
                href={report.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-line bg-white transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_16px_28px_rgba(17,24,39,0.08)]"
              >
                <MediaPlaceholder
                  icon={FileText}
                  label="Report cover — added periodically"
                  className="h-40 w-full"
                />
                <div className="flex flex-1 flex-col gap-3 p-7">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold tracking-[0.06em] opacity-50 uppercase">
                      {report.organisation} · {report.year}
                    </span>
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sky-500"
                      aria-hidden
                    />
                  </div>
                  <h3 className="font-display text-lg font-bold">
                    {report.title}
                  </h3>
                  <p className="flex-1 text-[15px] leading-relaxed opacity-75">
                    {report.description}
                  </p>
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Reveal>
  );
}
