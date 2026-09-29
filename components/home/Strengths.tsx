import Link from "next/link";

import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";

const PILLARS = [
  {
    n: "01",
    t: "Mentor-led Practice",
    d: "Learn from mentors working in the field today, through live sessions and applied practice rather than passive content.",
    href: "/about#mentors",
    dot: "bg-gray-900 text-white",
  },
  {
    n: "02",
    t: "Certified Courses",
    d: "Structured programs that lead to a certificate — proof the program was finished, not just started.",
    href: "/about#learning-path",
    dot: "bg-gray-900 text-white",
  },
  {
    n: "03",
    t: "Industry Connect",
    d: "Connection to the industries and roles where the skills you build are actually relevant.",
    href: "/about#upskilling",
    dot: "bg-sky-400 text-gray-900",
  },
];

export default function Strengths() {
  return (
    <section className="bg-slate-200">
      <Reveal className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 lg:px-16 lg:py-20">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Why CareerZeta
        </h6>
        <h2 className="mt-3.5 font-display text-4xl font-bold">
          Built around mentors, not modules
        </h2>

        <StaggerGroup className="mt-11 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <StaggerItem key={p.n} className="h-full">
              <Link
                href={p.href}
                className="flex h-full flex-col gap-3.5 rounded-2xl bg-white p-8 text-gray-900 transition-transform duration-150 hover:-translate-y-2"
              >
                <span
                  className={`flex h-[52px] w-[52px] items-center justify-center rounded-full font-display text-xl font-bold ${p.dot}`}
                >
                  {p.n}
                </span>
                <div className="font-display text-xl font-bold">{p.t}</div>
                <div className="flex-1 text-[15px] leading-relaxed opacity-75">
                  {p.d}
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Reveal>
    </section>
  );
}
