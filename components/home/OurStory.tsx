const ERAS = [
  { d: "1980s", t: "Personal computers reach the desk" },
  { d: "1990s", t: "The internet connects them" },
  { d: "2010s", t: "Mobile and cloud rewrite the job" },
  { d: "2020s", t: "AI compresses the timeline further" },
];

/**
 * Plain stacked grid, same at every breakpoint. Previously a pinned
 * position:sticky scroll-stepper on lg+ — dropped entirely: besides
 * scroll-jacking on touch devices, a sticky element inside an oversized
 * (420vh) ancestor renders broken (duplicated content, huge blank gaps)
 * whenever the page is captured at full height — which is exactly what a
 * phone's "capture full page" screenshot feature does, so this wasn't
 * just a rare edge case.
 */
export default function OurStory() {
  return (
    <section id="story" className="scroll-mt-24 bg-[#111827] text-white">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 lg:px-16 lg:py-20">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-400 uppercase">
          Why we started
        </h6>
        <h2 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight text-pretty lg:text-[38px]">
          We have seen technology evolve since Personal Computers were
          developed.
        </h2>
        <p className="mt-5 max-w-[50ch] text-lg text-slate-200">
          The world has changed, and the tech has changed faster than anything.
          CareerZeta exists to help professionals keep up with it.
        </p>
        <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ERAS.map((e) => (
            <div
              key={e.d}
              className="flex min-h-[150px] flex-col justify-center gap-2 rounded-2xl bg-white/5 p-7"
            >
              <div className="font-display text-3xl leading-none font-semibold tracking-[-0.03em] text-sky-400">
                {e.d}
              </div>
              <div className="font-display text-xl leading-tight font-semibold">
                {e.t}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
