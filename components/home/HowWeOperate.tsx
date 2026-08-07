"use client";

import { useState } from "react";

import { STEPS } from "@/lib/content";

export default function HowWeOperate() {
  const [openStep, setOpenStep] = useState<number | null>(null);

  return (
    <section
      id="operate"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-20 md:px-10 lg:px-16 lg:py-28"
    >
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        How we operate
      </h6>
      <h2 className="mt-3.5 font-display text-4xl font-bold">
        Batch by batch, mentor by mentor
      </h2>
      <p className="mt-2.5 text-[15px] opacity-60">
        Click a step for more detail.
      </p>

      <div className="relative mt-10 grid gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="absolute top-9 right-[3%] left-[3%] z-0 hidden h-[3px] bg-line lg:block" />

        {STEPS.map((step, i) => {
          const open = openStep === i;
          const isLast = i === STEPS.length - 1;

          return (
            <button
              key={step.title}
              type="button"
              onClick={() => setOpenStep(open ? null : i)}
              aria-expanded={open}
              className="relative z-10 cursor-pointer px-5 text-left"
            >
              <div
                className={`flex h-18 w-18 items-center justify-center rounded-full transition-transform duration-300 ${
                  isLast ? "bg-sky-400" : "bg-gray-900"
                } ${open ? "scale-110" : "scale-100"}`}
              >
                <step.icon
                  className={`h-8 w-8 ${isLast ? "text-slate-900" : "text-white"}`}
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>

              <div className="mt-5 font-display text-[19px] font-bold">
                {step.title}
              </div>
              <div className="mt-1.5 text-[15px] opacity-70">{step.short}</div>

              <div
                className={`overflow-hidden text-sm opacity-70 transition-all duration-300 ease-out ${
                  open ? "max-h-32 pt-2.5" : "max-h-0 pt-0"
                }`}
              >
                {step.detail}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
