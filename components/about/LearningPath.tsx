import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";

/** Draft copy — confirm these step descriptions with CareerZeta before shipping. */
const STEPS = [
  {
    t: "Learn",
    d: "Live, mentor-led classes that build the concepts.",
    h: 70,
    c: "bg-slate-200",
  },
  {
    t: "Practice",
    d: "Applied exercises and projects on real problems.",
    h: 112,
    c: "bg-sky-100",
  },
  {
    t: "Assess",
    d: "Checkpoints that show where you stand.",
    h: 154,
    c: "bg-slate-200",
  },
  {
    t: "Certify",
    d: "Every completed program is certified.",
    h: 196,
    c: "bg-sky-400",
  },
  {
    t: "Grow",
    d: "Keep upgrading as the technology moves.",
    h: 238,
    c: "bg-gray-900 text-white",
    dark: true,
  },
];

export default function LearningPath() {
  return (
    <Reveal
      id="learning-path"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-16 md:px-10 lg:px-16 lg:py-20"
    >
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        Learning path
      </h6>
      <h2 className="mt-3.5 font-display text-4xl font-bold">
        Learn, practice, assess, certify, grow
      </h2>

      <StaggerGroup className="mt-14 grid grid-cols-2 items-end gap-4 md:grid-cols-5">
        {STEPS.map((s, i) => (
          <StaggerItem key={s.t} className="flex flex-col gap-4">
            <div
              style={{ height: s.h }}
              className={`flex items-start rounded-2xl p-[18px] font-display text-2xl font-bold ${s.c}`}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div className="font-display text-xl font-bold">{s.t}</div>
              <div className="mt-1.5 text-sm leading-relaxed opacity-70">
                {s.d}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Reveal>
  );
}
