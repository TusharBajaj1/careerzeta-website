import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import { REPORTS } from "@/lib/resourcesContent";

export default function ReportsResearch() {
  const featured = REPORTS.find((r) => r.featured);
  const rest = REPORTS.filter((r) => !r.featured);

  return (
    <section id="reports" className="scroll-mt-24 bg-[#0b1220] text-white">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 lg:px-16">
        <Reveal>
          <h6 className="text-sm font-bold tracking-[0.06em] text-sky-400 uppercase">
            Reports &amp; research
          </h6>
          <h2 className="mt-4 max-w-[22ch] font-display text-[clamp(32px,4vw,52px)] leading-[1.1] font-semibold tracking-[-0.03em] text-pretty">
            Why the skills you&apos;re considering actually matter
          </h2>
        </Reveal>

        {featured && (
          <Reveal>
            <a
              href={featured.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-11 grid overflow-hidden rounded-[32px] border border-sky-300/20 bg-[#111c33] text-white md:grid-cols-2"
            >
              <div className="relative min-h-[320px] bg-slate-800">
                <Image
                  src={featured.image}
                  alt=""
                  fill
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-start justify-center gap-4 p-8 lg:p-12">
                <span className="text-xs font-bold tracking-[0.06em] text-sky-400 uppercase">
                  Featured · {featured.organisation} · {featured.year}
                </span>
                <h3 className="font-display text-[34px] leading-[1.15] font-semibold tracking-tight">
                  {featured.title}
                </h3>
                <p className="max-w-[54ch] text-[17px] leading-relaxed text-slate-300">
                  {featured.description}
                </p>
                <span className="mt-1.5 rounded-full bg-sky-400 px-7 py-[15px] text-[15px] font-bold text-[#111827]">
                  Read the report →
                </span>
              </div>
            </a>
          </Reveal>
        )}

        <StaggerGroup className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((r) => (
            <StaggerItem key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-full grid-cols-[130px_1fr] overflow-hidden rounded-3xl border border-sky-300/20 bg-[#111c33] text-white transition-colors duration-150 hover:border-sky-400 sm:grid-cols-[160px_1fr]"
              >
                <div className="relative min-h-[170px] bg-slate-800">
                  <Image
                    src={r.image}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2.5 p-[26px]">
                  <span className="text-xs font-bold tracking-[0.06em] text-sky-400 uppercase">
                    {r.organisation} · {r.year}
                  </span>
                  <h3 className="font-display text-[19px] leading-snug font-semibold tracking-tight text-pretty">
                    {r.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {r.description}
                  </p>
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
