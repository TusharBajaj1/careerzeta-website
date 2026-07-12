"use client";

import { motion } from "framer-motion";
import {
  Compass,
  Rocket,
  Check,
  ArrowRight,
  Brain,
  Sheet,
  Database,
  BarChart3,
  Code2,
  Sparkles,
  MessageSquare,
  Trophy,
  Building2,
  Hammer,
  Puzzle,
  Target,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
};

const cardStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const audiences = [
  {
    icon: Compass,
    title: "Career Transition",
    description:
      "Ideal for professionals looking to transition into Business Analytics by building practical, industry-relevant skills and confidence.",
    points: [
      "Transition into Business Analytics",
      "Learn industry-relevant tools",
      "Build practical project experience",
    ],
  },
  {
    icon: Rocket,
    title: "Career Growth",
    description:
      "Ideal for professionals looking to deepen their analytical capabilities, solve more complex business problems and grow into larger responsibilities.",
    points: [
      "Strengthen analytical thinking",
      "Work on real business problems",
      "Prepare for leadership opportunities",
    ],
  },
];

const roadmap = [
  {
    icon: Brain,
    title: "Business Thinking",
    description: "Build the foundation for framing business problems the right way.",
  },
  {
    icon: Sheet,
    title: "Excel",
    description: "Master the tool most business decisions still run on.",
  },
  {
    icon: Database,
    title: "SQL",
    description: "Learn to query and work confidently with structured data.",
  },
  {
    icon: BarChart3,
    title: "Power BI",
    description: "Turn raw data into dashboards that drive decisions.",
  },
  {
    icon: Code2,
    title: "Analytics with Python",
    description: "Use Python as an analytical tool to explore and interpret business data.",
  },
  {
    icon: Sparkles,
    title: "AI for Business",
    description: "Understand how to apply AI tools to support smarter business decisions.",
  },
  {
    icon: MessageSquare,
    title: "Business Storytelling",
    description: "Communicate insights clearly to stakeholders and leadership.",
  },
  {
    icon: Trophy,
    title: "Applied Business Project",
    description: "Bring every skill together in a real, end-to-end business project.",
  },
];

const philosophy = [
  {
    icon: Building2,
    title: "Industry-led",
    description:
      "Curriculum shaped by working professionals and current industry expectations.",
  },
  {
    icon: Hammer,
    title: "Practical Learning",
    description:
      "Every concept is reinforced through hands-on exercises, not just theory.",
  },
  {
    icon: Puzzle,
    title: "Real Business Problems",
    description:
      "Work through scenarios modeled on actual business and analytics challenges.",
  },
  {
    icon: Target,
    title: "Business Impact",
    description:
      "Structured to help learners apply their skills in ways that create real business value.",
  },
];

export default function ProgramsPage() {
  return (
    <>
      {/* Hero */}
      <motion.section
        className="relative flex min-h-[70vh] items-center overflow-hidden bg-white px-6 py-20 md:px-10 lg:px-16"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1.5px 1.5px, rgb(226 232 240) 1.5px, transparent 0)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-200/40 via-indigo-200/30 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            className="mx-auto inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700 shadow-sm ring-1 ring-slate-200/70"
            variants={fadeInUp}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            The Program
          </motion.div>

          <motion.h1
            className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
            variants={fadeInUp}
          >
            Business Analytics{" "}
            <span className="text-transparent bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-600 bg-clip-text">
              Program
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl"
            variants={fadeInUp}
          >
            Industry-led learning designed for working professionals looking to transition into
            Business Analytics or strengthen their analytical capabilities.
          </motion.p>

          <motion.div className="mt-10 flex justify-center" variants={fadeInUp}>
            <button className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-950/15">
              Talk to Us
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2.25}
              />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Who is this Program For */}
      <motion.section
        className="bg-white px-6 py-24 md:px-10 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div className="mx-auto max-w-3xl text-center" variants={fadeInUp}>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Who Is This{" "}
              <span className="text-transparent bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-600 bg-clip-text">
                Program For?
              </span>
            </h2>
          </motion.div>

          <motion.div className="mt-16 grid gap-6 lg:grid-cols-2" variants={cardStagger}>
            {audiences.map((audience) => {
              const Icon = audience.icon;
              return (
                <motion.div
                  key={audience.title}
                  className="group flex h-full flex-col rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-[0_28px_80px_rgba(15,23,42,0.1)] sm:p-10"
                  variants={fadeInUp}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm transition group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-indigo-600">
                    <Icon className="h-7 w-7" strokeWidth={1.75} />
                  </div>

                  <h3 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
                    {audience.title}
                  </h3>

                  <p className="mt-4 text-base leading-7 text-slate-600">
                    {audience.description}
                  </p>

                  <ul className="mt-6 flex flex-col gap-3">
                    {audience.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <span className="text-sm font-medium text-slate-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* What You'll Learn — Roadmap */}
      <motion.section
        className="bg-slate-50/60 px-6 py-24 md:px-10 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="mx-auto max-w-4xl">
          <motion.div className="mx-auto max-w-3xl text-center" variants={fadeInUp}>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              What You&apos;ll{" "}
              <span className="text-transparent bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-600 bg-clip-text">
                Learn
              </span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
              A structured path that takes you from business fundamentals to a complete,
              real-world applied project.
            </p>
          </motion.div>

          <motion.div className="relative mt-20" variants={cardStagger}>
            <div className="pointer-events-none absolute bottom-6 left-7 top-6 w-px bg-gradient-to-b from-sky-300 via-slate-200 to-indigo-300 sm:left-8" />

            <div className="flex flex-col gap-8">
              {roadmap.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    className="group relative flex items-start gap-5 sm:gap-6"
                    variants={fadeInUp}
                  >
                    <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm transition group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-indigo-600 group-hover:text-white sm:h-16 sm:w-16">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.75} />
                    </div>

                    <div className="flex-1 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Step {index + 1}
                        </span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Learning Philosophy */}
      <motion.section
        className="bg-white px-6 py-24 md:px-10 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div className="mx-auto max-w-3xl text-center" variants={fadeInUp}>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Our Learning{" "}
              <span className="text-transparent bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-600 bg-clip-text">
                Philosophy
              </span>
            </h2>
          </motion.div>

          <motion.div
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={cardStagger}
          >
            {philosophy.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  className="flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-[0_28px_80px_rgba(15,23,42,0.08)]"
                  variants={fadeInUp}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        className="bg-slate-50/60 px-6 py-24 md:px-10 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        <motion.div
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-8 py-16 text-center shadow-[0_28px_80px_rgba(15,23,42,0.12)] sm:px-16"
          variants={fadeInUp}
        >
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ready to Learn More?
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg">
              Talk to us to understand whether this program is the right fit for your career
              goals.
            </p>

            <div className="mt-8 flex justify-center">
              <button className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-slate-100 hover:shadow-xl">
                Talk to Us
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.25}
                />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </>
  );
}