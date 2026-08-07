import Link from "next/link";

import Reveal from "@/components/ui/Reveal";

export default function ClosingCta() {
  return (
    <Reveal className="bg-gradient-to-br from-slate-900 to-gray-900 px-6 py-20 text-center md:px-10 lg:px-16 lg:py-25">
      <div className="mx-auto max-w-[800px]">
        <h2 className="font-display text-[38px] font-bold text-white">
          Ready to build your next chapter?
        </h2>
        <p className="mt-4 text-lg text-white opacity-80">
          Questions about a program, mentorship, or partnering with us — reach
          out.
        </p>
        <Link
          href="/contact"
          className="mt-7 inline-block rounded-lg bg-sky-400 px-8 py-4 text-[17px] font-bold text-slate-900 transition-transform duration-150 hover:scale-105"
        >
          Contact us
        </Link>
      </div>
    </Reveal>
  );
}
