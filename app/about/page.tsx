"use client";

import { motion } from "framer-motion";
import { Hammer, Target, Brain, TrendingUp, ArrowRight } from "lucide-react";

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

const principles = [
  {
    icon: Hammer,
    title: "Practical Learning",
    description:
      "Every concept is reinforced through hands-on exercises and real-world application, not theory alone.",
  },
  {
    icon: Target,
    title: "Industry Relevance",
    description:
      "Curriculum shaped by current industry expectations, tools and the way businesses actually operate.",
  },
  {
    icon: Brain,
    title: "Analytical Thinking",
    description:
      "Building the ability to frame problems clearly and draw sound conclusions from data.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Growth",
    description:
      "Supporting professionals at every stage, from first transition to long-term career advancement.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <motion.section
        className="relative overflow-hidden bg-white px-6 pb-16 pt-16 md:px-10 lg:px-16"
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
          <motion.h1
            className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
            variants={fadeInUp}
          >
            About{" "}
            <span className="text-transparent bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-600 bg-clip-text">
              CareerZeta
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl"
            variants={fadeInUp}
          >
            Preparing professionals for a world where business decisions are increasingly driven
            by data, technology and AI.
          </motion.p>
        </div>
      </motion.section>

      {/* Vision + Mission */}
      <motion.section
        className="bg-slate-50/60 px-6 py-20 md:px-10 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <motion.div
            className="flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10"
            variants={fadeInUp}
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              Our Vision
            </span>
            <p className="mt-6 text-lg leading-8 text-slate-700 sm:text-xl">
              To become one of India&apos;s most trusted learning platforms for working
              professionals seeking practical, industry-relevant business education.
            </p>
          </motion.div>

          <motion.div
            className="flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10"
            variants={fadeInUp}
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Our Mission
            </span>
            <p className="mt-6 text-lg leading-8 text-slate-700 sm:text-xl">
              To bridge the gap between traditional learning and evolving industry expectations
              through practical, application-oriented education.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Core Principles */}
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
              Our Core{" "}
              <span className="text-transparent bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-600 bg-clip-text">
                Principles
              </span>
            </h2>
          </motion.div>

          <motion.div
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={cardStagger}
          >
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <motion.div
                  key={principle.title}
                  className="group flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-[0_28px_80px_rgba(15,23,42,0.08)]"
                  variants={fadeInUp}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white transition group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-indigo-600">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">
                    {principle.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {principle.description}
                  </p>
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
              Ready to Start Your Journey?
            </h2>

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