import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import { PROGRAMS_HOW_WE_OPERATE } from "@/lib/programsDetail";

export default function HowWeOperate() {
  return (
    <section id="how-we-operate" className="scroll-mt-[165px] bg-slate-200">
      <Reveal className="mx-auto grid max-w-[1400px] items-start gap-16 px-6 py-16 md:grid-cols-2 md:px-10 lg:px-16 lg:py-20">
        <div className="md:sticky md:top-24">
          <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
            How we operate
          </h6>
          <h2 className="mt-4 font-display text-4xl leading-tight font-bold text-balance">
            From registration to placement support
          </h2>
          <p className="mt-5 max-w-[44ch] text-base opacity-75">
            Six stages, the same for every program.
          </p>
        </div>

        <StaggerGroup className="relative flex flex-col gap-4">
          <div
            aria-hidden
            className="absolute top-7 bottom-7 left-[27px] w-[3px] rounded-sm bg-gray-900/15"
          />
          {PROGRAMS_HOW_WE_OPERATE.map((step, i) => {
            const last = i === PROGRAMS_HOW_WE_OPERATE.length - 1;
            return (
              <StaggerItem
                key={step.number}
                className="relative flex items-center gap-6 rounded-2xl bg-white py-4 pr-6 pl-4 transition-transform duration-150 hover:translate-x-2"
              >
                <span
                  className={`flex h-14 w-14 flex-none items-center justify-center rounded-full font-display text-xl font-bold ${
                    last ? "bg-sky-400 text-gray-900" : "bg-gray-900 text-white"
                  }`}
                >
                  {step.number}
                </span>
                <div>
                  <div className="font-display text-xl font-bold">
                    {step.title}
                  </div>
                  <div className="mt-1 text-[15px] leading-relaxed opacity-75">
                    {step.detail}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Reveal>
    </section>
  );
}
