import Image from "next/image";
import Link from "next/link";

import Reveal from "@/components/ui/Reveal";

const PILLARS = [
  {
    n: "01",
    t: "Mentor-led Practice",
    d: "Learn from mentors working in the field today, through live sessions and applied practice rather than passive content.",
    href: "/about#mentors",
    img: "/home/pexels-karola-g-7876668.png",
    c: "bg-[#111827] text-white",
  },
  {
    n: "02",
    t: "Certified Courses",
    d: "Structured programs that lead to a certificate — proof the program was finished, not just started.",
    href: "/about#learning-path",
    img: "/home/pexels-rdne-7580704.png",
    c: "bg-sky-400 text-[#111827]",
  },
  {
    n: "03",
    t: "Industry Connect",
    d: "Connection to the industries and roles where the skills you build are actually relevant.",
    href: "/about#upskilling",
    img: "/home/pexels-googledeepmind-17485738.png",
    c: "bg-sky-100 text-[#111827]",
  },
];

export default function Strengths() {
  return (
    <Reveal className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-16 lg:py-[110px]">
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        Why CareerZeta
      </h6>
      <h2 className="mt-4 mb-12 font-display text-4xl leading-tight font-semibold tracking-tight lg:text-5xl">
        Built around mentors, not modules
      </h2>

      <div className="grid gap-5 md:grid-cols-3">
        {PILLARS.map((p) => (
          <Link
            key={p.n}
            href={p.href}
            className={`flex min-h-[420px] flex-col gap-4 rounded-[28px] p-9 transition-transform duration-150 hover:-translate-y-2 ${p.c}`}
          >
            <div className="relative h-[170px] overflow-hidden rounded-[18px]">
              <Image
                src={p.img}
                alt=""
                fill
                sizes="(min-width:768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <span className="font-display text-[40px] leading-none font-semibold tracking-[-0.04em]">
              {p.n}
            </span>
            <div className="font-display text-[26px] font-semibold tracking-tight">
              {p.t}
            </div>
            <div className="flex-1 text-base leading-normal">{p.d}</div>
            <div className="text-[15px] font-bold">Learn more →</div>
          </Link>
        ))}
      </div>
    </Reveal>
  );
}
