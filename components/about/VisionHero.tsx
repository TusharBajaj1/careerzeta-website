"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { useReducedMotion } from "@/lib/useReducedMotion";

const HERO_PHOTO = "/about/pepper-robot.jpg";

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

export default function VisionHero() {
  const y = useScrollY();
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[600px] overflow-hidden bg-[#0b1220] text-white">
      <div aria-hidden className="absolute inset-y-0 right-0 w-[55%] overflow-hidden">
        <Image
          src={HERO_PHOTO}
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover"
          style={{
            objectPosition: "center 30%",
            ...(reducedMotion
              ? {}
              : { transform: `translateY(${Math.round(y * -0.06)}px) scale(1.08)` }),
          }}
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#0b1220] from-45% via-[#0b1220]/80 via-[62%] to-[#0b1220]/45"
      />
      <div className="relative mx-auto max-w-[1400px] px-6 pt-[170px] pb-[100px] md:px-10 lg:px-16">
        <div className="max-w-[760px]">
          <div className="mb-6 inline-flex rounded-full border border-sky-300/50 px-[18px] py-2 text-[13px] font-bold tracking-[0.06em] text-sky-300 uppercase">
            Purpose / Vision
          </div>
          <h1 className="font-display text-[clamp(36px,5vw,72px)] leading-[1.04] font-semibold tracking-[-0.03em] text-pretty">
            CareerZeta is built with the vision to keep professionals{" "}
            <span className="text-sky-400">on pace with technology</span>{" "}
            development.
          </h1>
          <p className="mt-8 max-w-[50ch] text-lg text-slate-300">
            Not a one-time course. A standing habit of upgrading, mentor by
            mentor, skill by skill.
          </p>
        </div>
      </div>
    </section>
  );
}
