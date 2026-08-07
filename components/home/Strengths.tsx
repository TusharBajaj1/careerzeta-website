import { Award, TrendingUp, Users, Video } from "lucide-react";

import Reveal from "@/components/ui/Reveal";

const strengths = [
  {
    icon: Users,
    title: "Qualified mentors",
    text: "Learn from people working in the field today.",
    tint: true,
  },
  {
    icon: Video,
    title: "Live, not recorded",
    text: "Real-time classes, on a set batch schedule.",
    tint: false,
  },
  {
    icon: Award,
    title: "Certification",
    text: "Every completed program is certified.",
    tint: true,
  },
  {
    icon: TrendingUp,
    title: "Industry connect",
    text: "Partnerships that support career opportunities.",
    tint: false,
  },
];

export default function Strengths() {
  return (
    <Reveal className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-16 lg:py-28">
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        Our strengths
      </h6>
      <h2 className="mt-3.5 font-display text-4xl font-bold">
        Built around mentors, not modules
      </h2>

      <div className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {strengths.map((strength) => (
          <div
            key={strength.title}
            className={`flex flex-col gap-3.5 rounded-2xl p-8 transition duration-200 hover:-translate-y-2 hover:scale-[1.02] ${
              strength.tint
                ? "bg-sky-100 hover:shadow-[0_16px_28px_rgba(3,105,161,0.18)]"
                : "bg-slate-200 hover:shadow-[0_16px_28px_rgba(17,24,39,0.15)]"
            }`}
          >
            <strength.icon
              className={`h-8.5 w-8.5 ${
                strength.tint ? "text-sky-700" : "text-gray-900"
              }`}
              strokeWidth={1.5}
              aria-hidden
            />
            <div className="font-display text-lg font-bold">
              {strength.title}
            </div>
            <div className="text-[15px] opacity-70">{strength.text}</div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
