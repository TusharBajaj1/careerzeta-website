import Link from "next/link";
import { Briefcase, Users } from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";

export default function WorkWithUs() {
  return (
    <Reveal
      id="work-with-us"
      className="scroll-mt-24 bg-slate-50 px-6 pt-16 pb-10 md:px-10 lg:px-16 lg:pt-20 lg:pb-14"
    >
      <div className="mx-auto max-w-[1400px]">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Work with us
        </h6>
        <h2 className="mt-3.5 max-w-[36ch] font-display text-4xl font-bold">
          Help professionals build the skills they need for what&apos;s next.
        </h2>

        <StaggerGroup className="mt-11 grid gap-8 md:grid-cols-2">
          <StaggerItem className="rounded-2xl border-2 border-line bg-white p-8 transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(17,24,39,0.08)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100">
              <Users
                className="h-5 w-5 text-sky-600"
                strokeWidth={1.75}
                aria-hidden
              />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold">
              Become a Mentor
            </h3>
            <p className="mt-2.5 text-[15px] leading-relaxed opacity-75">
              We&apos;re building a network of experienced professionals who
              bring real industry experience into our programs — teaching,
              mentoring, sharing what they know, and guiding learners through
              applied practice.
            </p>
            <Link
              href="#work-with-us-form"
              className="mt-5 inline-block text-sm font-bold text-sky-700 underline decoration-sky-400 decoration-2 underline-offset-4"
            >
              Express interest
            </Link>
          </StaggerItem>

          <StaggerItem className="rounded-2xl border-2 border-line bg-white p-8 transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(17,24,39,0.08)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100">
              <Briefcase
                className="h-5 w-5 text-sky-600"
                strokeWidth={1.75}
                aria-hidden
              />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold">
              Join CareerZeta
            </h3>
            <p className="mt-2.5 text-[15px] leading-relaxed opacity-75">
              We don&apos;t have any open roles right now. Don&apos;t see a
              role that fits? We&apos;d still like to hear from you.
            </p>
            <Link
              href="#work-with-us-form"
              className="mt-5 inline-block text-sm font-bold text-sky-700 underline decoration-sky-400 decoration-2 underline-offset-4"
            >
              Share your CV / Express interest
            </Link>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </Reveal>
  );
}
