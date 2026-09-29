import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";

const WHY = [
  {
    n: "01",
    t: "The world is changing",
    bg: "bg-sky-100",
    icon: (
      <svg viewBox="0 0 120 80" className="h-20 w-[120px]" aria-hidden="true">
        <circle cx="60" cy="40" r="34" fill="none" stroke="#0369a1" strokeWidth="2" />
        <circle cx="60" cy="40" r="22" fill="none" stroke="#0369a1" strokeWidth="2" strokeOpacity=".6" />
        <circle cx="60" cy="40" r="10" fill="#38bdf8" />
        <circle cx="94" cy="40" r="5" fill="#111827" />
      </svg>
    ),
  },
  {
    n: "02",
    t: "Work is evolving",
    bg: "bg-slate-200",
    icon: (
      <svg viewBox="0 0 120 80" className="h-20 w-[120px]" aria-hidden="true">
        <rect x="12" y="24" width="44" height="44" rx="8" fill="#111827" />
        <rect x="40" y="10" width="44" height="44" rx="8" fill="#38bdf8" fillOpacity=".85" />
        <rect x="68" y="24" width="44" height="44" rx="8" fill="none" stroke="#0369a1" strokeWidth="2" />
      </svg>
    ),
  },
  {
    n: "03",
    t: "Skills can become outdated",
    bg: "bg-sky-100",
    icon: (
      <svg viewBox="0 0 120 80" className="h-20 w-[120px]" aria-hidden="true">
        <rect x="10" y="20" width="16" height="52" rx="4" fill="#111827" />
        <rect x="34" y="30" width="16" height="42" rx="4" fill="#111827" fillOpacity=".7" />
        <rect x="58" y="42" width="16" height="30" rx="4" fill="#111827" fillOpacity=".4" />
        <rect x="82" y="54" width="16" height="18" rx="4" fill="#111827" fillOpacity=".2" />
        <path d="M14 10 L90 46" stroke="#0369a1" strokeWidth="2" strokeDasharray="4 5" fill="none" />
      </svg>
    ),
  },
  {
    n: "04",
    t: "Learning needs to be continuous",
    bg: "bg-[#111827] text-white",
    dark: true,
    icon: (
      <svg viewBox="0 0 120 80" className="h-20 w-[120px]" aria-hidden="true">
        <path d="M30 52 a30 24 0 1 1 20 22" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
        <path d="M52 76 l-16 -2 l10 -14 z" fill="#38bdf8" />
        <circle cx="60" cy="40" r="7" fill="#fff" />
      </svg>
    ),
  },
];

export default function WhyWeStarted() {
  return (
    <Reveal
      id="why-we-started"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-14 md:px-10 lg:px-16 lg:py-16"
    >
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        Why we started
      </h6>
      <h2 className="mt-3.5 max-w-[28ch] font-display text-4xl font-bold">
        The world changed faster than most careers could keep up.
      </h2>

      <StaggerGroup className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WHY.map((w) => (
          <StaggerItem
            key={w.n}
            className={`flex flex-col gap-5 rounded-2xl p-7 transition-transform duration-150 hover:-translate-y-2 ${w.bg}`}
          >
            {w.icon}
            <div>
              <div
                className={`text-xs font-bold tracking-[0.06em] ${
                  w.dark ? "text-sky-400" : "text-sky-700"
                }`}
              >
                {w.n}
              </div>
              <div className="mt-1.5 font-display text-xl font-bold">
                {w.t}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <p className="mt-11 max-w-[60ch] text-lg leading-relaxed">
        That&apos;s why CareerZeta exists: we help professionals build
        future-ready skills and stay on pace with technology and their
        careers.
      </p>
    </Reveal>
  );
}
