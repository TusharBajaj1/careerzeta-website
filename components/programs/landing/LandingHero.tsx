"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import BrochureButton from "@/components/programs/BrochureButton";
import EnrollButton from "@/components/programs/EnrollButton";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { ProgramSummary } from "@/lib/content";
import type { ProgramDetail } from "@/lib/programsDetail";
import type { ProgramLandingData } from "@/lib/programLandingData";

const PHOTO: Record<string, string> = {
  "data-analytics": "/home/pexels-rdne-7580704.png",
  "business-analytics": "/home/pexels-karola-g-7876668.png",
  "data-science": "/home/pexels-cottonbro-5473956.png",
};
const FALLBACK_PHOTO = "/home/pexels-googledeepmind-17485738.png";

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

type LandingHeroProps = {
  program: ProgramSummary;
  detail: ProgramDetail;
  landing: ProgramLandingData;
};

export default function LandingHero({ program, detail, landing }: LandingHeroProps) {
  const y = useScrollY();
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[680px] overflow-hidden bg-[#0b1220] text-white">
      <div aria-hidden className="absolute inset-y-0 right-0 w-full overflow-hidden md:w-[58%]">
        <Image
          src={PHOTO[program.slug] ?? FALLBACK_PHOTO}
          alt=""
          fill
          priority
          sizes="(min-width:768px) 58vw, 100vw"
          className="object-cover"
          style={reducedMotion ? undefined : { transform: `translateY(${Math.round(y * -0.06)}px) scale(1.08)` }}
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#0b1220] from-[38%] via-[#0b1220]/85 via-[55%] to-[#0b1220]/30"
      />

      <div className="relative mx-auto grid max-w-[1400px] items-end gap-12 px-6 pt-36 pb-16 md:px-10 lg:grid-cols-2 lg:px-16 lg:pt-40">
        <div>
          <div className="mb-6 flex flex-wrap gap-2.5">
            <span className="inline-flex rounded-full bg-sky-400 px-[18px] py-2 text-[13px] font-bold tracking-[0.03em] text-[#111827]">
              {detail.level}
            </span>
            {detail.duration && (
              <span className="inline-flex rounded-full border border-sky-300/50 px-[18px] py-2 text-[13px] font-bold tracking-[0.03em] text-sky-300 uppercase">
                {detail.duration}
              </span>
            )}
          </div>
          <h1 className="font-display text-[clamp(34px,4.6vw,64px)] leading-[1.04] font-semibold tracking-[-0.03em] text-pretty">
            {program.name}
          </h1>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-slate-300">
            {detail.context}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <EnrollButton programSlug={program.slug} programName={program.name} />
            {detail.brochureUrl && (
              <BrochureButton url={detail.brochureUrl} programName={program.name} variant="light" />
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-sky-300/30 bg-[#0b1220]/70 p-6 backdrop-blur">
          <div className="grid grid-cols-2 gap-5">
            {landing.heroStats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-semibold text-sky-400">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-slate-200/20 pt-5">
            <div className="text-xs font-bold tracking-[0.06em] text-sky-400 uppercase">Program fee</div>
            <div className="mt-1 font-display text-xl font-bold">{detail.fee ?? "Fee on request"}</div>
            {detail.fee && <div className="mt-0.5 text-xs text-slate-400">Inclusive of all taxes</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
