"use client";

import { motion } from "framer-motion";
import { Compass, Rocket, Check, ArrowRight } from "lucide-react";

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

export default function TargetAudience() {
  return (
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
          <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
            Whether you are looking to transition into Business Analytics or strengthen your
            existing analytical capabilities, CareerZeta is designed to support your professional
            growth.
          </p>
        </motion.div>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-center text-base font-medium text-slate-500 sm:text-lg"
          variants={fadeInUp}
        >
          Every professional starts from a different point. Our learning paths are designed to
          meet you where you are and help you reach your next career milestone.
        </motion.p>

        <motion.div
          className="mt-16 grid gap-6 lg:grid-cols-2"
          variants={cardStagger}
        >
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

                <div className="mt-8 flex-1" />

                <button className="group/btn inline-flex w-fit items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50">
                  View Learning Path
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                    strokeWidth={2.25}
                  />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
