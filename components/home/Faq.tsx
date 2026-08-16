"use client";

import { useState } from "react";

import { FAQS } from "@/lib/content";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="mx-auto max-w-[900px] scroll-mt-24 px-6 py-20 md:px-10 lg:px-16 lg:py-28"
    >
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        Questions
      </h6>
      <h2 className="mt-3.5 font-display text-4xl font-bold">
        Frequently asked
      </h2>

      <div className="mt-9 border-t-2 border-line">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;

          return (
            <div key={faq.q} className="border-b-2 border-line">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-1 py-6 text-left"
              >
                <span className="font-display text-lg font-bold">{faq.q}</span>
                <span
                  aria-hidden
                  className={`inline-block text-[22px] font-bold text-sky-400 transition-transform duration-300 ${
                    isOpen ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </button>

              <div
                className={`max-w-[70ch] overflow-hidden px-1 text-base leading-relaxed opacity-75 transition-all duration-300 ease-out ${
                  isOpen ? "max-h-50 pb-6" : "max-h-0 pb-0"
                }`}
              >
                {faq.a}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
