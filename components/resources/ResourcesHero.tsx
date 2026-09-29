import Reveal from "@/components/ui/Reveal";

export default function ResourcesHero() {
  return (
    <Reveal className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 pt-16 pb-16 md:grid-cols-2 md:px-10 lg:px-16">
      <div>
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Resources
        </h6>
        <h1 className="mt-4 max-w-[18ch] font-display text-4xl leading-[1.1] font-bold text-balance lg:text-[52px]">
          Understand how data, AI and technology are changing work
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#stories"
            className="rounded-lg bg-sky-400 px-[26px] py-[15px] text-[15px] font-bold text-gray-900 transition-transform duration-150 hover:scale-105"
          >
            Real-world stories
          </a>
          <a
            href="#reports"
            className="rounded-lg border-2 border-gray-900 px-6 py-[13px] text-[15px] font-bold text-gray-900 transition-transform duration-150 hover:scale-105"
          >
            Reports &amp; research
          </a>
        </div>
      </div>

      {/* Stacked-documents motif, ambient float. */}
      <svg
        viewBox="0 0 440 340"
        className="cz-drift mx-auto w-full max-w-[480px]"
        aria-hidden="true"
      >
        <rect x="120" y="20" width="250" height="170" rx="16" fill="#e2e8f0" />
        <rect x="80" y="60" width="250" height="170" rx="16" fill="#e0f2fe" />
        <rect x="40" y="100" width="250" height="190" rx="16" fill="#111827" />
        <rect x="64" y="124" width="90" height="70" rx="10" fill="#38bdf8" />
        <polyline
          points="76,182 100,160 120,170 142,140"
          fill="none"
          stroke="#111827"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="170" y="128" width="96" height="8" rx="4" fill="#e2e8f0" />
        <rect x="170" y="148" width="70" height="8" rx="4" fill="#e2e8f0" fillOpacity=".5" />
        <rect x="170" y="168" width="82" height="8" rx="4" fill="#e2e8f0" fillOpacity=".5" />
        <rect x="64" y="216" width="200" height="8" rx="4" fill="#e2e8f0" fillOpacity=".35" />
        <rect x="64" y="236" width="150" height="8" rx="4" fill="#e2e8f0" fillOpacity=".35" />
        <circle cx="370" cy="250" r="34" fill="#38bdf8" />
        <path
          d="M356 250 h28 m-10 -10 l10 10 l-10 10"
          fill="none"
          stroke="#111827"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Reveal>
  );
}
