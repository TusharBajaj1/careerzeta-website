"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
const getReducedMotionSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServerSnapshot = () => false;

const ERAS = [
  { d: "1980s", t: "Personal computers reach the desk", s: 150 },
  { d: "1990s", t: "The internet connects them", s: 170 },
  { d: "2010s", t: "Mobile and cloud rewrite the job", s: 190 },
  { d: "2020s", t: "AI compresses the timeline further", s: 210 },
];

function StoryIntro() {
  return (
    <>
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-400 uppercase">
        Why we started
      </h6>
      <h2 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight text-pretty lg:text-[38px]">
        We have seen technology evolve since Personal Computers were
        developed.
      </h2>
      <p className="mt-5 max-w-[50ch] text-lg text-slate-200">
        The world has changed, and the tech has changed faster than anything.
        CareerZeta exists to help professionals keep up with it.
      </p>
    </>
  );
}

/** Pinned scroll-stepper through four eras; falls back to a plain stacked list under prefers-reduced-motion. */
export default function OurStory() {
  const ref = useRef<HTMLElement>(null);
  const [era, setEra] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  useEffect(() => {
    if (reducedMotion) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.max(
        0,
        Math.min(0.999, -r.top / Math.max(1, r.height - window.innerHeight)),
      );
      setEra(Math.floor(p * ERAS.length));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section id="story" className="scroll-mt-24 bg-[#111827] text-white">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 lg:px-16 lg:py-20">
          <StoryIntro />
          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ERAS.map((e) => (
              <div
                key={e.d}
                className="flex min-h-[150px] flex-col justify-center gap-2 rounded-2xl bg-white/5 p-7"
              >
                <div className="font-display text-3xl leading-none font-semibold tracking-[-0.03em] text-sky-400">
                  {e.d}
                </div>
                <div className="font-display text-xl leading-tight font-semibold">
                  {e.t}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      id="story"
      className="relative h-[420vh] scroll-mt-24 bg-[#111827] text-white"
    >
      <div className="sticky top-0 flex h-screen min-h-[620px] items-center overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1.5px 1.5px,#e2e8f0 1.5px,transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-14 px-6 md:px-10 lg:grid-cols-2 lg:px-16">
          <div>
            <StoryIntro />
            <div className="mt-8 flex gap-2">
              {ERAS.map((_, k) => (
                <span
                  key={k}
                  className={`h-1.5 rounded-sm transition-all duration-500 ${
                    k === era ? "w-11" : "w-4"
                  } ${k <= era ? "bg-sky-400" : "bg-slate-700"}`}
                />
              ))}
            </div>
          </div>

          <div className="relative h-[340px]">
            {ERAS.map((e, k) => (
              <div
                key={e.d}
                aria-hidden={k !== era}
                className="absolute inset-0 flex flex-col justify-center gap-4 transition-all duration-[600ms] ease-[cubic-bezier(.2,.8,.2,1)]"
                style={{
                  opacity: k === era ? 1 : 0,
                  transform: `translateY(${k < era ? -50 : k > era ? 50 : 0}px) scale(${k === era ? 1 : 0.94})`,
                }}
              >
                <div
                  className="font-display leading-[.9] font-semibold tracking-[-0.05em] text-sky-400"
                  style={{ fontSize: e.s }}
                >
                  {e.d}
                </div>
                <div className="max-w-[16ch] font-display text-3xl leading-tight font-semibold tracking-tight">
                  {e.t}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
