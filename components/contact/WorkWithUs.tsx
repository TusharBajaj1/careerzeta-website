import Link from "next/link";
import { Briefcase, Users } from "lucide-react";

import Reveal from "@/components/ui/Reveal";

export default function WorkWithUs() {
  return (
    <Reveal
      id="work-with-us"
      className="scroll-mt-24 bg-slate-50 px-6 py-20 md:px-10 lg:px-16 lg:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Work with us
        </h6>
        <h2 className="mt-3.5 max-w-[36ch] font-display text-4xl font-bold">
          Help professionals build the skills they need for what&apos;s next.
        </h2>

        <div className="mt-11 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-line bg-white p-8">
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
          </div>

          <div className="rounded-2xl border-2 border-line bg-white p-8">
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
          </div>
        </div>
      </div>
    </Reveal>
  );
}
