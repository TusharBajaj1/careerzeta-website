import Link from "next/link";

import Reveal from "@/components/ui/Reveal";

/** Draft copy — confirm heading and subline with CareerZeta before shipping. */
export default function AboutCta() {
  return (
    <Reveal className="bg-gradient-to-br from-[#111827] to-[#1e293b]">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-10 px-6 py-14 md:px-10 lg:px-16 lg:py-16">
        <div className="max-w-[640px]">
          <h2 className="font-display text-3xl leading-tight font-bold text-white lg:text-4xl">
            Live batches, taught by mentors working in the field today.
          </h2>
          <p className="mt-4 text-lg text-white opacity-80">
            See the programs and pick the next skill to add.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/programs"
            className="rounded-lg bg-sky-400 px-7 py-4 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105"
          >
            Explore programs
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border-2 border-white px-[26px] py-3.5 text-sm font-bold text-white transition-transform duration-150 hover:scale-105"
          >
            Talk to us
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
