import { PROGRAMS } from "@/lib/content";

export default function Marquee() {
  return (
    <section
      aria-hidden
      className="mt-16 overflow-hidden border-y border-slate-200 py-9 whitespace-nowrap"
    >
      <div className="inline-flex cz-marquee">
        {[0, 1].map((copy) => (
          <div key={copy} className="inline-flex gap-12 pr-12">
            {PROGRAMS.map((program) => (
              <span
                key={program.name}
                className="font-display text-lg font-bold text-gray-900 opacity-35"
              >
                {program.name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
