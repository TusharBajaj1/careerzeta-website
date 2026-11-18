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
      <div className="relative mx-auto max-w-[1400px] px-6 pt-[150px] pb-[90px] md:px-10 lg:px-16">
        <div className="max-w-[760px]">
          <div className="mb-6 inline-flex rounded-full border border-sky-300/50 px-[18px] py-2 text-[13px] font-bold tracking-[0.06em] text-sky-300 uppercase">
            Free Tools
          </div>
          <h1 className="font-display text-[clamp(36px,5vw,64px)] leading-[1.06] font-semibold tracking-[-0.03em] text-pretty">
            Small, free tools we&apos;ve built along the way
          </h1>
          <p className="mt-6 max-w-[55ch] text-lg text-slate-300">
            Side projects and experiments we keep around because people find them useful — some
            live on their own domains, some are still in progress. No sign-up, no catch.
          </p>
        </div>
      </div>
    </section>
  );
}
