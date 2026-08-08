import { ArrowUpRight } from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { REPORTS } from "@/lib/resourcesContent";

export default function ReportsResearch() {
  const featured = REPORTS.find((r) => r.featured);
  const rest = REPORTS.filter((r) => !r.featured);

  return (
    <Reveal
      id="reports"
      className="scroll-mt-24 bg-slate-50 px-6 py-20 md:px-10 lg:px-16 lg:py-28"
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
            className="group mt-11 flex flex-col gap-5 rounded-2xl border-2 border-sky-300 bg-white p-8 transition hover:border-sky-400 md:flex-row md:items-center md:justify-between lg:p-11"
          >
            <div>
              <span className="text-xs font-bold tracking-[0.06em] text-sky-700 uppercase">
                Featured · {featured.organisation} · {featured.year}
              </span>
              <h3 className="mt-2.5 font-display text-2xl font-bold md:text-[28px]">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-[65ch] text-base leading-relaxed opacity-75">
                {featured.description}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-2 rounded-lg bg-sky-400 px-6 py-3 text-sm font-bold whitespace-nowrap text-slate-900 transition-transform duration-150 group-hover:scale-105">
              Read
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
          </a>
        )}

        <div className="mt-8 border-t-2 border-line">
          {rest.map((report) => (
            <a
              key={report.title}
              href={report.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 border-b-2 border-line py-7 transition hover:bg-white md:flex-row md:items-start md:justify-between md:gap-8"
            >
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold tracking-[0.06em] opacity-50 uppercase">
                  {report.organisation} · {report.year}
                </span>
                <h3 className="mt-2 font-display text-xl font-bold">
                  {report.title}
                </h3>
                <p className="mt-2 max-w-[65ch] text-[15px] leading-relaxed opacity-75">
                  {report.description}
                </p>
              </div>

              <span className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-sky-700 whitespace-nowrap">
                Read
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </span>
            </a>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
