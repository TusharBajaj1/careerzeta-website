"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const HEADLINE: [string, string][] = [
  ["Stop", "text-white"],
  ["waiting.", "text-white"],
  ["Start", "text-sky-400"],
  ["building", "text-sky-400"],
  ["your", "text-sky-400"],
  ["future.", "text-sky-400"],
];

const TOOLS = [
  "Python",
  "SQL",
  "Power BI",
  "Excel",
  "Tableau",
  "ChatGPT",
  "Claude",
  "LangChain",
  "PyTorch",
  "Gemini",
];

export default function Hero() {
  const [y, setY] = useState(0);

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-[680px] overflow-hidden bg-[#0b1220] text-white"
    >
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-[58%] bg-no-repeat"
        style={{
          backgroundImage: "url(/home/pexels-cottonbro-5473956.png)",
          backgroundPosition: "18% 20%",
          backgroundSize: "auto 118%",
          transform: `translateY(${Math.round(y * -0.08)}px) scale(1.08)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#0b1220] from-45% via-[#0b1220]/80 via-60% to-transparent to-85%"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18] [mask-image:linear-gradient(90deg,#000,transparent_70%)]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1.5px 1.5px,#7dd3fc 1.5px,transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 pt-[170px] pb-[130px] md:px-10 lg:px-16">
        <div className="max-w-[700px]">
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-sky-300/50 px-[18px] py-2 text-[13px] font-bold tracking-[0.06em] text-sky-300 uppercase">
            <span className="cz-pulse-glow h-2 w-2 rounded-full bg-sky-400" />
            Online courses &amp; mentorship
          </div>

          <h1 className="flex flex-wrap gap-x-[.25em] font-display text-[clamp(38px,5.4vw,80px)] leading-none font-semibold tracking-[-0.03em]">
            {HEADLINE.map(([word, color], i) => (
              <span
                key={i}
                className={`inline-block animate-[cz-word_.8s_cubic-bezier(.2,.8,.2,1)_both] ${color}`}
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                {word}
              </span>
            ))}
          </h1>

          <p className="mt-7 max-w-[48ch] text-lg text-slate-300">
            Technology has changed faster than anything since the personal
            computer. CareerZeta pairs learners with qualified mentors so
            professionals keep moving with it, not behind it.
          </p>

          <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-sky-300/30 bg-white/5 px-[18px] py-2 text-sm text-slate-200">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse" />
            Now enrolling: <b className="text-white">All programs</b>
          </div>

          <div className="mt-7 flex flex-wrap gap-3.5">
            <Link
              href="/programs"
              className="cz-pulse-glow rounded-full bg-sky-400 px-8 py-[18px] text-[17px] font-bold text-[#111827] transition-transform duration-150 hover:scale-105"
            >
              See programs
            </Link>
            <Link
              href="/contact"
              className="rounded-full border-2 border-white px-[30px] py-4 text-[17px] font-bold text-white transition-transform duration-150 hover:scale-105"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-sky-300/25 bg-[#0b1220]/70 py-[18px]"
        aria-label={TOOLS.join(", ")}
      >
        <div
          aria-hidden
          className="flex w-max animate-[cz-marquee_26s_linear_infinite] text-[15px] font-bold tracking-[0.04em] text-slate-200 uppercase"
        >
          {[0, 1].map((k) =>
            TOOLS.map((tool) => (
              <span key={`${k}${tool}`} className="flex items-center whitespace-nowrap">
                <span className="px-7">{tool}</span>
                <span className="text-sky-400">/</span>
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
