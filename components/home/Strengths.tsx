import Link from "next/link";
import { Award, Handshake, Users } from "lucide-react";

import Reveal from "@/components/ui/Reveal";

const pillars = [
  {
    icon: Users,
    title: "Mentor-led Practice",
    text: "Learn from mentors working in the field today, through live sessions and applied practice rather than passive content.",
    href: "/about#mentors",
    tint: true,
  },
  {
    icon: Award,
    title: "Certified Courses",
    text: "Structured programs that lead to a certificate — proof the program was finished, not just started.",
    href: "/about#learning-path",
    tint: false,
  },
  {
    icon: Handshake,
    title: "Industry Connect",
    text: "Connection to the industries and roles where the skills you build are actually relevant.",
    href: "/about#upskilling",
    tint: true,
  },
];

export default function Strengths() {
  return (
    <Reveal className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-16 lg:py-28">
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        Why CareerZeta
      </h6>
      <h2 className="mt-3.5 font-display text-4xl font-bold">
        Built around mentors, not modules
      </h2>

      <div className="mt-11 grid gap-6 sm:grid-cols-3">
        {pillars.map((pillar) => (
          <Link
            key={pillar.title}
            href={pillar.href}
            className={`flex flex-col gap-3.5 rounded-2xl p-8 transition duration-200 hover:-translate-y-2 hover:scale-[1.02] ${
              pillar.tint
                ? "bg-sky-100 hover:shadow-[0_16px_28px_rgba(3,105,161,0.18)]"
                : "bg-slate-200 hover:shadow-[0_16px_28px_rgba(17,24,39,0.15)]"
            }`}
          >
            <pillar.icon
              className={`h-8.5 w-8.5 ${
                pillar.tint ? "text-sky-700" : "text-gray-900"
              }`}
              strokeWidth={1.5}
              aria-hidden
            />
            <div className="font-display text-lg font-bold">
              {pillar.title}
            </div>
            <div className="text-[15px] opacity-70">{pillar.text}</div>
          </Link>
        ))}
      </div>
    </Reveal>
  );
}
