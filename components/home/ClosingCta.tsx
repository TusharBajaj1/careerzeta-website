"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Reveal from "@/components/ui/Reveal";
import { CONTACT, EXTERNAL_STAT } from "@/lib/content";

/** Counts up to `to` once, the first time it scrolls into view. */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = () => {
          const k = Math.min(1, (performance.now() - start) / 1600);
          setN(Math.round(to * (1 - (1 - k) ** 3)));
          if (k < 1) requestAnimationFrame(tick);
        };
        tick();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <div
      ref={ref}
      className="font-display text-[clamp(88px,10vw,140px)] leading-[.9] font-semibold tracking-[-0.05em] text-sky-400"
    >
      {n}%
    </div>
  );
}

export default function ClosingCta() {
  return (
    <section className="relative overflow-hidden bg-[#111827] text-white">
      <div
        aria-hidden
        className="cz-blob absolute -bottom-[40%] -left-[10%] h-[620px] w-[620px] bg-sky-400 opacity-[0.22]"
      />

      <Reveal
        id="contact"
        className="relative mx-auto grid max-w-[1400px] scroll-mt-24 items-center gap-14 px-6 py-20 md:px-10 lg:grid-cols-2 lg:px-16 lg:py-[110px]"
      >
        <div>
          <CountUp to={40} />
          <div className="mt-3.5 max-w-[20ch] font-display text-[26px] leading-tight font-semibold tracking-tight">
            {EXTERNAL_STAT.headline}
          </div>
          <div className="mt-1 text-sm text-slate-400">
            — {EXTERNAL_STAT.source}
          </div>
        </div>

        <div>
          <h2 className="font-display text-4xl leading-tight font-semibold tracking-tight lg:text-5xl">
            Ready to build your next chapter?
          </h2>
          <p className="mt-4 text-lg text-slate-200">
            Questions about a program, mentorship, or partnering with us —
            reach out.
          </p>
          <div className="mt-6 flex flex-wrap gap-7 font-bold">
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-white hover:text-sky-400"
            >
              {CONTACT.email}
            </a>
            <a
              href={`tel:${CONTACT.phone}`}
              className="text-white hover:text-sky-400"
            >
              {CONTACT.phone}
            </a>
          </div>
          <Link
            href="/contact"
            className="cz-pulse-glow mt-8 inline-block rounded-full bg-sky-400 px-9 py-[18px] text-[17px] font-bold text-[#111827] transition-transform duration-150 hover:scale-105"
          >
            Contact us
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
