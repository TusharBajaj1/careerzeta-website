import Reveal from "@/components/ui/Reveal";
import BrochureButton from "@/components/programs/BrochureButton";
import EnrollButton from "@/components/programs/EnrollButton";
import type { ProgramDetail } from "@/lib/programsDetail";

export default function LandingFinalCta({
  programSlug,
  programName,
  detail,
}: {
  programSlug: string;
  programName: string;
  detail: ProgramDetail;
}) {
  return (
    <section className="overflow-hidden bg-sky-400 text-[#111827]">
      <Reveal className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-10 px-6 py-24 md:px-10 lg:px-16">
        <h2 className="max-w-[16ch] font-display text-[clamp(32px,4.5vw,56px)] leading-[1.05] font-semibold tracking-[-0.03em]">
          Ready to start {programName}?
        </h2>
        <div className="flex max-w-[420px] flex-col gap-5">
          <p className="text-[17px] leading-normal">
            Seats fill by cohort — talk to our team or pay your fee to lock in your batch.
          </p>
          <div className="flex flex-wrap items-center gap-3.5">
            <EnrollButton programSlug={programSlug} programName={programName} />
            {detail.brochureUrl && <BrochureButton url={detail.brochureUrl} programName={programName} />}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
