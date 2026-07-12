"use client";

import { motion } from "framer-motion";
import { BarChart3, BrainCircuit, Globe, TrendingUp, ArrowRight } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
};

const cards = [
  {
    icon: BarChart3,
    title: "Better Business Decisions",
    description:
      "Organizations increasingly rely on data and analytics to support strategic, operational and customer-focused decisions.",
  },
  {
    icon: BrainCircuit,
    title: "Business + Technology",
    description:
      "Business Analytics combines business understanding, analytical thinking, data and technology to solve real business problems.",
  },
  {
    icon: Globe,
    title: "Across Every Industry",
    chips: [
      "Banking",
      "Retail",
      "Healthcare",
      "Technology",
      "Manufacturing",
      "Consulting",
      "Agriculture",
      "Logistics",
    ],
  },
  {
    icon: TrendingUp,
    title: "A Skill That Grows With You",
    description:
      "Business Analytics supports professionals throughout their careers—from improving decision-making in their current role to enabling transitions into consulting, product management, strategy, operations and analytics-focused roles.",
  },
];

export default function IndustryOverview() {
  return (
    <motion.section
      className="relative overflow-hidden bg-white px-6 py-20 md:px-10 lg:px-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger}
    >
      {/* Background texture, matched to Hero */}
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

      <div className="relative mx-auto max-w-7xl">
        <motion.div className="mx-auto max-w-3xl text-center" variants={fadeInUp}>
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700 shadow-sm ring-1 ring-slate-200/70">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            Why It Matters
          </div>

          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Why Business Analytics Matters{" "}
            <span className="text-transparent bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-600 bg-clip-text">
              Today
            </span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
            Organizations today are expected to make faster, smarter and more informed decisions.
            Business Analytics has become a critical capability that enables professionals to
            transform data into meaningful business outcomes.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                className="group flex flex-col rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-[0_28px_80px_rgba(15,23,42,0.1)]"
                variants={fadeInUp}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm transition group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-indigo-600">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>

                <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">
                  {card.title}
                </h3>

                {card.description && (
                  <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
                )}

                {card.chips && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {card.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition group-hover:border-slate-300"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="relative mt-16 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-8 py-12 text-center shadow-[0_28px_80px_rgba(15,23,42,0.12)] sm:px-16"
          variants={fadeInUp}
        >
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1.5px 1.5px, rgb(255 255 255) 1.5px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-200 ring-1 ring-white/10">
              Industry Insight
            </span>

            <p className="mt-6 text-xl font-semibold leading-8 text-white sm:text-2xl">
              Business Analytics isn&apos;t just another technical skill—it is becoming a core
              business capability.
            </p>

            <p className="mt-4 text-sm text-slate-400">
              Inspired by research from Gartner and McKinsey.
            </p>

            <div className="mt-8 flex justify-center">
              <button className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-slate-100 hover:shadow-xl">
                Explore the Program
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.25} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}