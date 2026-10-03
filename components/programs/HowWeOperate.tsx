import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import { PROGRAMS_HOW_WE_OPERATE } from "@/lib/programsDetail";

export default function HowWeOperate() {
  return (
    <section id="how-we-operate" className="scroll-mt-[165px] bg-[#0b1220] text-white">
      <Reveal className="mx-auto grid max-w-[1400px] items-start gap-16 px-6 py-20 md:px-10 lg:grid-cols-2 lg:px-16 lg:py-[110px]">
        <div className="lg:sticky lg:top-24">
          <h6 className="text-sm font-bold tracking-[0.06em] text-sky-400 uppercase">
            How we operate
          </h6>
          <h2 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight text-pretty lg:text-[44px]">
            From registration to placement support
          </h2>
          <p className="mt-5 max-w-[40ch] text-[17px] text-slate-300">
            Six stages, the same for every program.
          </p>
        </div>

        <StaggerGroup className="flex flex-col gap-3.5">
          {PROGRAMS_HOW_WE_OPERATE.map((step, i) => {
            const last = i === PROGRAMS_HOW_WE_OPERATE.length - 1;
            return (
              <StaggerItem
                key={step.number}
                className="flex items-center gap-[22px] rounded-[18px] border border-sky-300/20 bg-[#111c33] py-[18px] pr-[26px] pl-[18px]"
              >
                <span
                  className={`flex h-14 w-14 flex-none items-center justify-center rounded-2xl font-display text-xl font-semibold text-[#111827] ${
                    last ? "bg-sky-400" : "bg-sky-100"
                  }`}
                >
                  {step.number}
                </span>
                <div>
                  <div className="font-display text-xl font-semibold tracking-tight">
                    {step.title}
                  </div>
                  <div className="mt-1 text-[15px] leading-normal text-slate-300">
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
