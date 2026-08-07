import { CONTACT } from "@/lib/content";

export default function ContactStrip() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 px-6 py-20 md:px-10 lg:px-16 lg:py-25"
    >
      <div className="mx-auto max-w-[1400px]">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Contact
        </h6>
        <h2 className="mt-3.5 font-display text-[32px] font-bold">
          Let&apos;s talk
        </h2>

        <div className="mt-8 flex flex-wrap gap-14">
          <div>
            <div className="text-sm opacity-60">Email</div>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-1.5 block text-xl text-sky-700 hover:text-sky-900"
            >
              {CONTACT.email}
            </a>
          </div>
          <div>
            <div className="text-sm opacity-60">Web</div>
            <div className="mt-1.5 text-xl">{CONTACT.web}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
