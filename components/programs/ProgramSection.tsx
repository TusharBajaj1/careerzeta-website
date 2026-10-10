"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import BrochureButton from "@/components/programs/BrochureButton";
import EnrollButton from "@/components/programs/EnrollButton";
import Reveal from "@/components/ui/Reveal";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { ProgramSummary } from "@/lib/content";
import type { ProgramDetail } from "@/lib/programsDetail";

/** Reused from the Home v2 handoff — byte-identical files already in /public/home/, same mapping as Home's program tabs. */
const PHOTO: Record<string, string> = {
  "data-analytics": "/home/pexels-rdne-7580704.png",
  "business-analytics": "/home/pexels-karola-g-7876668.png",
  "data-science": "/home/pexels-cottonbro-5473956.png",
  "generative-agentic-ai": "/home/pexels-googledeepmind-18069697.png",
  "investment-banking": "/home/pexels-tima-miroshnichenko-7567482.png",
  "cyber-security": "/home/pexels-shkrabaanthony-5475760.png",
};
const FALLBACK_PHOTO = "/home/pexels-googledeepmind-17485738.png";

const eyebrow = "text-xs font-bold tracking-[0.06em] uppercase text-sky-700";

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

type ProgramSectionProps = {
  program: ProgramSummary;
  detail: ProgramDetail;
  index: number;
};

export default function ProgramSection({
  program,
  detail,
  index,
}: ProgramSectionProps) {
  const y = useScrollY();
  const reducedMotion = useReducedMotion();
  const num = String(index + 1).padStart(2, "0");
  const steps = detail.whatYoullDo;

  return (
    <section
      id={program.slug}
      className={`scroll-mt-[165px] ${index % 2 ? "bg-slate-100" : "bg-white"}`}
    >
      <div className="mx-auto max-w-[1400px] px-6 pt-[72px] pb-[88px] md:px-10 lg:px-16">
        <Reveal>
          <div className="relative h-[340px] overflow-hidden rounded-[32px] bg-[#111827]">
            <div aria-hidden className="absolute -inset-y-[6%] inset-x-0 overflow-hidden">
              <Image
                src={PHOTO[program.slug] ?? FALLBACK_PHOTO}
                alt=""
                fill
                sizes="(min-width:1400px) 1336px, 100vw"
                className="object-cover"
                style={
                  reducedMotion
                    ? undefined
                    : {
                        transform: `translateY(${Math.round((y - 900 - index * 1100) * -0.06)}px)`,
                      }
                }
              />
            </div>
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#0b1220]/90 via-[#0b1220]/25 to-[#0b1220]/10"
            />
            <div className="absolute inset-x-9 bottom-7 flex flex-wrap items-end justify-between gap-5 text-white">
              <div className="flex flex-wrap items-end gap-5">
                <span className="font-display text-[clamp(64px,9vw,120px)] leading-[.85] font-semibold tracking-[-0.05em] text-sky-400">
                  {num}
                </span>
                <h2 className="font-display text-[clamp(30px,4vw,52px)] leading-[1.05] font-semibold tracking-[-0.03em]">
                  {program.name}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <span className="rounded-full bg-sky-400 px-[18px] py-[9px] text-sm font-bold text-[#111827]">
                  {detail.level}
                </span>
                {detail.duration && (
                  <span className="rounded-full border border-white/40 bg-white/15 px-[18px] py-2 text-sm font-bold">
                    {detail.duration}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid items-start gap-14 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="font-display text-[28px] leading-snug font-semibold tracking-tight text-sky-700 text-pretty">
              {detail.question}
            </p>
            <p className="mt-4 max-w-[56ch] text-[17px] leading-relaxed text-slate-800">
              {detail.context}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {detail.reasons.map((reason) => (
                <li
                  key={reason}
                  className="flex items-start gap-3 text-base leading-normal"
                >
                  <span className="mt-[7px] h-2.5 w-2.5 shrink-0 rounded-full bg-sky-400" />
                  {reason}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/contact"
                className="rounded-full bg-[#111827] px-[30px] py-4 text-base font-bold text-white transition-transform duration-150 hover:scale-105"
              >
                Get Admission
              </Link>
              {detail.brochureUrl ? (
                <BrochureButton url={detail.brochureUrl} programName={program.name} />
              ) : (
                <span className="text-sm font-bold text-slate-800">
                  Brochure — coming soon
                </span>
              )}
            </div>
          </Reveal>

          <Reveal className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-[30px] shadow-[0_24px_60px_-30px_rgba(17,24,39,.35)]">
            <div>
              <div className={eyebrow}>Program Fee</div>
              <div className="mt-1 font-display text-xl font-bold">
                {detail.fee ?? "Fee on request"}
              </div>
              {detail.fee && (
                <>
                  <div className="mt-0.5 text-xs opacity-50">
                    Inclusive of all taxes
                  </div>
                  <div className="mt-4">
                    <EnrollButton programSlug={program.slug} programName={program.name} />
                  </div>
                </>
              )}
            </div>
            <div>
              <div className={eyebrow}>Prerequisites</div>
              <div className="mt-1 text-[15px] leading-normal">
                {detail.prerequisites}
              </div>
            </div>
            {detail.tools.length > 0 && (
              <div>
                <div className={eyebrow}>Tools you&apos;ll use</div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {detail.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full bg-[#111827] px-4 py-2 text-sm font-bold text-white"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className={eyebrow}>Roles you can aim for</div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {detail.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-sky-100 px-4 py-2 text-sm font-bold"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {steps.length > 0 && (
          <Reveal className="mt-14">
            <div className={`${eyebrow} mb-5`}>What you&apos;ll do</div>
            <ol className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
              {steps.map((step, i) => {
                const last = i === steps.length - 1;
                return (
                  <li key={step} className="flex flex-col gap-3.5">
                    <div className="flex items-center">
                      <span
                        className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-bold ${
                          last ? "bg-sky-400 text-[#111827]" : "bg-[#111827] text-white"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={`h-[3px] flex-1 rounded-sm ${last ? "bg-transparent" : "bg-slate-300"}`}
                      />
                    </div>
                    <div className="pr-2 text-[15px] leading-snug font-bold">
                      {step}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        )}
      </div>
    </section>
  );
}
