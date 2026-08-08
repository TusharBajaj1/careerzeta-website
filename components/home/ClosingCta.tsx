import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { CONTACT } from "@/lib/content";

export default function ClosingCta() {
  return (
    <Reveal
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-slate-900 to-gray-900 px-6 py-14 text-center md:px-10 lg:px-16 lg:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -left-10 h-64 w-64 rounded-full bg-sky-400 opacity-10 blur-[60px] cz-float-blob-1"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -bottom-16 h-72 w-72 rounded-full bg-sky-400 opacity-8 blur-[60px] cz-float-blob-2"
      />

      <div className="relative mx-auto max-w-[800px]">
        <h2 className="font-display text-[38px] font-bold text-white">
          Ready to build your next chapter?
        </h2>
        <p className="mt-4 text-lg text-white opacity-80">
          Questions about a program, mentorship, or partnering with us — reach
          out.
        </p>
        <Link
          href="/contact"
          className="mt-7 inline-block rounded-lg bg-sky-400 px-8 py-4 text-[17px] font-bold text-slate-900 transition-transform duration-150 hover:scale-105 cz-pulse-glow"
        >
          Contact us
        </Link>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/15 pt-7">
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-2 text-[15px] text-white opacity-80 transition hover:opacity-100"
          >
            <Mail className="h-4 w-4" aria-hidden />
            {CONTACT.email}
          </a>
          <a
            href={`tel:${CONTACT.phone}`}
            className="flex items-center gap-2 text-[15px] text-white opacity-80 transition hover:opacity-100"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {CONTACT.phone}
          </a>
        </div>
      </div>
    </Reveal>
  );
}
