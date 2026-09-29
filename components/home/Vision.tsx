import Image from "next/image";

import Reveal from "@/components/ui/Reveal";

export default function Vision() {
  return (
    <section className="bg-gradient-to-br from-[#111827] to-[#1e293b]">
      <Reveal className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-10 px-6 py-14 md:px-10 lg:px-16 lg:py-16">
        <Image
          src="/brand/careerzeta-mark-white.png"
          alt=""
          width={72}
          height={72}
          className="h-[72px] w-auto"
        />
        <div className="min-w-[300px] max-w-[820px] flex-1">
          <h6 className="text-sm font-bold tracking-[0.06em] text-sky-400 uppercase">
            Purpose / Vision
          </h6>
          <h2 className="mt-4 font-display text-3xl leading-tight font-bold text-balance text-white lg:text-[38px]">
            CareerZeta is built with the vision to keep professionals on pace
            with technology development.
          </h2>
          <p className="mt-4 max-w-[60ch] text-lg text-slate-200">
            Not a one-time course. A standing habit of upgrading, mentor by
            mentor, skill by skill.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
