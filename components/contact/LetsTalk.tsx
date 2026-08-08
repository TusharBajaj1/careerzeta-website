import { Mail, Phone } from "lucide-react";

import EnquiryForm from "@/components/contact/EnquiryForm";
import { CONTACT } from "@/lib/content";

export default function LetsTalk() {
  return (
    <section
      id="lets-talk"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-16 md:px-10 lg:px-16 lg:py-20"
    >
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        Contact
      </h6>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">
        Let&apos;s talk
      </h1>

      <div className="mt-11 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <p className="max-w-[50ch] text-lg leading-relaxed opacity-75">
            Questions about a program, mentorship, or partnering with
            CareerZeta — reach out and we&apos;ll get back to you.
          </p>

          <div className="mt-8 flex flex-col gap-6">
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-3.5 transition hover:text-sky-700"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100">
                <Mail
                  className="h-5 w-5 text-sky-600"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </span>
              <div>
                <div className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
                  Email
                </div>
                <div className="mt-0.5 font-semibold">{CONTACT.email}</div>
              </div>
            </a>

            <a
              href={`tel:${CONTACT.phone}`}
              className="flex items-center gap-3.5 transition hover:text-sky-700"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100">
                <Phone
                  className="h-5 w-5 text-sky-600"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </span>
              <div>
                <div className="text-xs font-bold tracking-[0.06em] uppercase opacity-50">
                  Phone
                </div>
                <div className="mt-0.5 font-semibold">{CONTACT.phone}</div>
              </div>
            </a>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-line bg-white p-6 sm:p-8">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
