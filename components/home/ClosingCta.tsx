import Link from "next/link";

import Reveal from "@/components/ui/Reveal";
import { CONTACT } from "@/lib/content";

export default function ClosingCta() {
  return (
    <section className="bg-gradient-to-br from-[#111827] to-[#1e293b]">
      <Reveal
        id="contact"
        className="mx-auto flex max-w-[1400px] scroll-mt-24 flex-wrap items-center justify-between gap-10 px-6 py-14 md:px-10 lg:px-16 lg:py-16"
      >
        <div className="max-w-[620px]">
          <h2 className="font-display text-3xl leading-tight font-bold text-white lg:text-4xl">
            Ready to build your next chapter?
          </h2>
          <p className="mt-4 text-lg text-slate-200">
            Questions about a program, mentorship, or partnering with us —
            reach out.
          </p>
          <div className="mt-6 flex flex-wrap gap-7 font-bold">
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-white transition hover:text-sky-400"
            >
              {CONTACT.email}
            </a>
            <a
              href={`tel:${CONTACT.phone}`}
              className="text-white transition hover:text-sky-400"
            >
              {CONTACT.phone}
            </a>
          </div>
        </div>
        <Link
          href="/contact"
          className="cz-pulse-glow rounded-lg bg-sky-400 px-8 py-4 text-[17px] font-bold text-gray-900 transition-transform duration-150 hover:scale-105"
        >
          Contact us
        </Link>
      </Reveal>
    </section>
  );
}
