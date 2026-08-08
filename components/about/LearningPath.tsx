import Reveal from "@/components/ui/Reveal";

const steps = ["Learn", "Practice", "Assess", "Certify", "Grow"];

export default function LearningPath() {
  return (
    <Reveal
      id="learning-path"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-20 md:px-10 lg:px-16 lg:py-28"
    >
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        Learning path
      </h6>
      <h2 className="mt-3.5 font-display text-4xl font-bold">
        Learn, practice, assess, certify, grow
      </h2>

      <div className="relative mt-14 grid grid-cols-2 gap-y-10 sm:grid-cols-5">
        <div className="absolute top-3.5 right-[4%] left-[4%] z-0 hidden h-[3px] bg-line sm:block" />

        {steps.map((step, i) => (
          <div key={step} className="relative z-10 pr-6">
            <div
              className={`h-7 w-7 rounded-full ${
                i === steps.length - 1 ? "bg-sky-400 cz-dot-pulse" : "bg-gray-900"
              }`}
            />
            <div className="mt-4.5 font-display text-lg font-bold">{step}</div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
