import Link from "next/link";

import Reveal from "@/components/ui/Reveal";

/** Solid aqua so the page doesn't open and close with the same dark block. */
export default function ProgramsCta() {
  return (
    <section className="overflow-hidden bg-sky-400 text-[#111827]">
      <Reveal className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-10 px-6 py-24 md:px-10 lg:px-16">
        <h2 className="max-w-[14ch] font-display text-[clamp(36px,5vw,68px)] leading-[1.02] font-semibold tracking-[-0.03em]">
          Ready to get started?
        </h2>
        <div className="max-w-[420px]">
          <p className="text-[19px] leading-normal">
            Talk to us about which program fits where you are today.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-[#111827] px-9 py-[18px] text-[17px] font-bold text-white transition-transform duration-150 hover:scale-105"
          >
            Get Admission
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
