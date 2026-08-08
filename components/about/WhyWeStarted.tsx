import Image from "next/image";

import Reveal from "@/components/ui/Reveal";

export default function WhyWeStarted() {
  return (
    <Reveal
      id="why-we-started"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-16 md:px-10 lg:px-16 lg:py-20"
    >
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        Why we started
      </h6>
      <h2 className="mt-3.5 max-w-[28ch] font-display text-4xl font-bold">
        The world changed faster than most careers could keep up.
      </h2>

      <div className="mt-11 overflow-hidden rounded-2xl border-2 border-line bg-white">
        <div className="overflow-x-auto">
          <Image
            src="/brand/why-we-started-sketch.png"
            alt="The world is changing, work is evolving, skills can become outdated, learning needs to be continuous — that's why CareerZeta exists: we help professionals build future-ready skills and stay on pace with technology and their careers."
            width={1536}
            height={1024}
            className="h-auto w-full min-w-[1100px]"
          />
        </div>
      </div>
      <p className="mt-2.5 text-xs opacity-50 lg:hidden">
        Swipe to see the full sequence.
      </p>
    </Reveal>
  );
}
