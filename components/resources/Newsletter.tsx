import NewsletterForm from "@/components/resources/NewsletterForm";
import Reveal from "@/components/ui/Reveal";

export default function Newsletter() {
  return (
    <Reveal
      id="newsletter"
      className="scroll-mt-24 bg-gradient-to-br from-[#111827] to-[#1e293b] px-6 py-14 md:px-10 lg:px-16 lg:py-20"
    >
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <h6 className="text-sm font-bold tracking-[0.06em] text-sky-300 uppercase">
            Quarterly newsletter
          </h6>
          <h2 className="mt-3.5 font-display text-4xl font-bold text-white">
            Stay ahead of what&apos;s changing
          </h2>
          <p className="mt-4 text-lg text-slate-200">
            Technology trends, changing skills, real-world stories, and new
            CareerZeta programs — a few times a year, nothing more.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 sm:p-8">
          <NewsletterForm />
        </div>
      </div>
    </Reveal>
  );
}
