import Reveal from "@/components/ui/Reveal";

export default function Vision() {
  return (
    <Reveal className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-slate-800 px-6 py-16 md:px-10 lg:px-16 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 right-5 font-display text-[200px] leading-none font-bold text-white opacity-8 select-none lg:text-[380px] cz-float-slow"
      >
        CZ
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-300 uppercase">
          Purpose / Vision
        </h6>
        <p className="mt-4 max-w-[24ch] font-display text-3xl leading-[1.3] font-bold text-white lg:text-[42px]">
          CareerZeta is built with the vision to keep professionals on pace with
          technology development.
        </p>
        <p className="mt-[22px] max-w-[50ch] text-[19px] text-white opacity-85">
          Not a one-time course. A standing habit of upgrading, mentor by
          mentor, skill by skill.
        </p>
      </div>
    </Reveal>
  );
}
