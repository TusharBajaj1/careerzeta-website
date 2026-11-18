export default function ToolsHero() {
  return (
    <section className="relative overflow-hidden bg-[#0b1220] text-white">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18] [mask-image:linear-gradient(180deg,#000,transparent_70%)]"
        style={{
          backgroundImage: "radial-gradient(circle at 1.5px 1.5px,#7dd3fc 1.5px,transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 pt-[160px] pb-[110px] md:px-10 lg:px-16">
        <div className="relative inline-block">
          {/* Animated "comment" callout — a speech-bubble sitting above the
              headline, gently floating, with a tail pointing down into it. */}
          <div className="cz-float-slow absolute -top-[72px] left-1 -rotate-6 sm:-top-20 sm:left-4">
            <div className="relative rounded-2xl border-2 border-sky-400 bg-sky-400 px-5 py-2.5 text-[15px] font-bold whitespace-nowrap text-[#111827] shadow-[0_12px_30px_-8px_rgba(56,189,248,0.6)] sm:text-[17px]">
              Free Tools for Everyone
              <span
                aria-hidden
                className="absolute -bottom-[7px] left-9 h-4 w-4 rotate-45 border-r-2 border-b-2 border-sky-400 bg-sky-400"
              />
            </div>
          </div>

          <h1 className="font-display text-[clamp(56px,11vw,140px)] leading-[0.95] font-semibold tracking-[-0.03em]">
            Productivity
          </h1>
        </div>

        <p className="mt-6 max-w-[55ch] text-lg text-slate-300">
          Free tools and side projects we keep around because people find them useful — each one
          lives on its own, built its own way.
        </p>
      </div>
    </section>
  );
}
