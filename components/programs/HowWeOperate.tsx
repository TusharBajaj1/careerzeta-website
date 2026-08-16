import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import { PROGRAMS_HOW_WE_OPERATE } from "@/lib/programsDetail";

export default function HowWeOperate() {
  return (
    <Reveal
      id="how-we-operate"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-16 md:px-10 lg:px-16 lg:py-20"
    >
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        How we operate
      </h6>
      <h2 className="mt-3.5 font-display text-4xl font-bold">
        From registration to placement support
      </h2>

      <StaggerGroup className="relative mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <div className="absolute top-3.5 right-[2%] left-[2%] z-0 hidden h-[3px] bg-line lg:block" />

        {PROGRAMS_HOW_WE_OPERATE.map((step, i) => (
          <StaggerItem key={step.number} className="relative z-10 pr-6">
            <div
              className={`h-7 w-7 rounded-full ${
                i === PROGRAMS_HOW_WE_OPERATE.length - 1
                  ? "bg-sky-400 cz-dot-pulse"
                  : "bg-gray-900"
              }`}
            />
            <div className="mt-4.5 font-display text-[15px] font-bold">
              {step.number} — {step.title}
            </div>
            <div className="mt-1.5 text-sm opacity-65">{step.detail}</div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Reveal>
  );
}
