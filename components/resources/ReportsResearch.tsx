import Image from "next/image";
import { ArrowUpRight, FileText } from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import { REPORTS } from "@/lib/resourcesContent";

export default function ReportsResearch() {
  const featured = REPORTS.find((r) => r.featured);
  const rest = REPORTS.filter((r) => !r.featured);

  return (
    <section id="reports" className="scroll-mt-24">
      <Reveal className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 lg:px-16 lg:py-20">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Reports &amp; research
        </h6>
        <h2 className="mt-4 max-w-[28ch] font-display text-4xl leading-tight font-bold text-balance">
          Why the skills you&apos;re considering actually matter
        </h2>

        {featured && (
          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 grid overflow-hidden rounded-2xl bg-gray-900 text-white transition-transform duration-150 hover:-translate-y-2 md:grid-cols-2"
          >
            <div className="relative min-h-[280px] bg-slate-800">
              {featured.image ? (
                <Image
                  src={featured.image}
                  alt=""
                  fill
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <MediaPlaceholder
                  icon={FileText}
                  label="Report cover — added periodically"
                  className="h-full w-full"
                  tone="dark"
                />
              )}
            </div>
            <div className="flex flex-col items-start justify-center gap-4 p-8 lg:p-12">
              <span className="text-xs font-bold tracking-[0.06em] text-sky-400 uppercase">
                Featured · {featured.organisation} · {featured.year}
              </span>
              <h3 className="font-display text-2xl leading-tight font-bold md:text-[28px]">
                {featured.title}
              </h3>
              <p className="max-w-[56ch] text-base leading-relaxed text-slate-200">
                {featured.description}
              </p>
              <span className="mt-2 flex items-center gap-2 rounded-lg bg-sky-400 px-[26px] py-3.5 text-[15px] font-bold text-gray-900">
                Read
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </a>
        )}

        <StaggerGroup className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((r) => (
            <StaggerItem key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-full grid-cols-[130px_1fr] overflow-hidden rounded-2xl bg-sky-100 text-gray-900 transition-transform duration-150 hover:-translate-y-2 sm:grid-cols-[150px_1fr]"
              >
                <div className="relative min-h-[150px] bg-slate-200">
                  {r.image ? (
                    <Image
                      src={r.image}
                      alt=""
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  ) : (
                    <MediaPlaceholder
                      icon={FileText}
                      label="Report cover"
                      className="h-full w-full"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2.5 p-6">
                  <span className="text-xs font-bold tracking-[0.06em] text-sky-700 uppercase">
                    {r.organisation} · {r.year}
                  </span>
                  <h3 className="font-display text-lg leading-snug font-bold text-pretty">
                    {r.title}
                  </h3>
                  <p className="text-sm leading-relaxed opacity-75">
                    {r.description}
                  </p>
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Reveal>
    </section>
  );
}
