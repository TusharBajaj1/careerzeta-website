"use client";

import { useEffect, useState } from "react";

import { useReducedMotion } from "@/lib/useReducedMotion";

/** Pexels photo from the v3 handoff — no attribution required. */
const HERO_PHOTO = "/resources/pexels-leeloothefirst-5562086.png";

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

export default function ResourcesHero() {
  const y = useScrollY();
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[600px] overflow-hidden bg-[#0b1220] text-white">
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-[55%] bg-cover"
        style={{
          backgroundImage: `url(${HERO_PHOTO})`,
          backgroundPosition: "center 35%",
          transform: reducedMotion
            ? undefined
            : `translateY(${Math.round(y * -0.06)}px) scale(1.08)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#0b1220] from-45% via-[#0b1220]/80 via-[62%] to-[#0b1220]/45"
      />
      <div className="relative mx-auto max-w-[1400px] px-6 pt-[170px] pb-[100px] md:px-10 lg:px-16">
        <div className="max-w-[760px]">
          <div className="mb-6 inline-flex rounded-full border border-sky-300/50 px-[18px] py-2 text-[13px] font-bold tracking-[0.06em] text-sky-300 uppercase">
            Resources
          </div>
          <h1 className="font-display text-[clamp(36px,5vw,72px)] leading-[1.04] font-semibold tracking-[-0.03em] text-pretty">
            Understand how{" "}
            <span className="text-sky-400">data, AI and technology</span> are
            changing work
          </h1>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <a
              href="#stories"
              className={`${reducedMotion ? "" : "cz-pulse-glow"} rounded-full bg-sky-400 px-[30px] py-[17px] text-base font-bold text-[#111827] transition-transform duration-150 hover:scale-105`}
            >
              Real-world stories
            </a>
            <a
              href="#reports"
              className="rounded-full border-2 border-white px-7 py-[15px] text-base font-bold text-white transition-transform duration-150 hover:scale-105"
            >
              Reports &amp; research
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
