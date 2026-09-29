import Reveal from "@/components/ui/Reveal";

export default function VisionHero() {
  return (
    <Reveal className="bg-gradient-to-br from-[#111827] to-[#1e293b]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 px-6 py-16 md:px-10 lg:grid-cols-2 lg:px-16 lg:py-20">
        <div>
          <h6 className="text-sm font-bold tracking-[0.06em] text-sky-300 uppercase">
            Purpose / Vision
          </h6>
          <h1 className="mt-4 max-w-[24ch] font-display text-3xl leading-[1.3] font-bold text-white lg:text-[42px]">
            CareerZeta is built with the vision to keep professionals on pace
            with technology development.
          </h1>
          <p className="mt-[22px] max-w-[50ch] text-[19px] text-white opacity-85">
            Not a one-time course. A standing habit of upgrading, mentor by
            mentor, skill by skill.
          </p>
        </div>

        {/* Rising-bars motif: ambient float + a dashed trend line drawing across it. */}
        <svg
          viewBox="0 0 440 360"
          className="cz-drift mx-auto w-full max-w-[460px]"
          aria-hidden="true"
        >
          <rect x="30" y="250" width="70" height="80" rx="10" fill="#1e293b" stroke="#38bdf8" strokeOpacity=".4" />
          <rect x="120" y="200" width="70" height="130" rx="10" fill="#1e293b" stroke="#38bdf8" strokeOpacity=".5" />
          <rect x="210" y="150" width="70" height="180" rx="10" fill="#1e293b" stroke="#38bdf8" strokeOpacity=".7" />
          <rect x="300" y="100" width="70" height="230" rx="10" fill="#38bdf8" />
          <path
            d="M65 225 L155 175 L245 125 L335 70"
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="3"
            strokeDasharray="8 8"
            className="cz-dash"
          />
          <circle cx="65" cy="225" r="8" fill="#e0f2fe" />
          <circle cx="155" cy="175" r="8" fill="#e0f2fe" />
          <circle cx="245" cy="125" r="8" fill="#e0f2fe" />
          <path d="M335 70 l-4 -22 l22 6 z" fill="#fff" transform="rotate(20 335 70)" />
          <circle cx="335" cy="70" r="10" fill="#fff" />
          <line x1="20" y1="330" x2="400" y2="330" stroke="#e2e8f0" strokeOpacity=".4" strokeWidth="2" />
        </svg>
      </div>
    </Reveal>
  );
}
