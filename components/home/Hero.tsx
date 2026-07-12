"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

const journey = [
  "Excel",
  "SQL",
  "Power BI",
  "Analytics with Python",
  "AI for Business",
  "Business Storytelling",
];

const highlights = [
  "Practical Learning",
  "Real Business Projects",
  "Industry-Focused Curriculum",
  "Career Guidance",
];

export default function Hero() {
  return (
    <motion.section
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-white px-6 py-12 md:px-10 lg:px-16"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {/* Background Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1.5px 1.5px,rgb(226 232 240) 1.5px,transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-200/40 via-indigo-200/30 to-transparent blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.42fr_0.58fr]">

        {/* LEFT COLUMN */}

        <motion.div
          className="flex flex-col justify-center gap-8"
          variants={fadeInUp}
        >

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700 shadow-sm ring-1 ring-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            CareerZeta
          </div>

          <div className="space-y-6">

            <motion.h1
              className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
              variants={fadeInUp}
            >
              Build Your Career in{" "}
              <span className="bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-600 bg-clip-text text-transparent">
                Business Analytics
              </span>
            </motion.h1>

            <motion.p
              className="max-w-xl text-lg leading-8 text-slate-600 sm:text-xl"
              variants={fadeInUp}
            >
              Industry-led learning designed for professionals looking to
              transition into Business Analytics or accelerate their careers
              through practical, application-oriented learning.
            </motion.p>

          </div>

          <motion.div variants={fadeInUp}>

            <Link
              href="/programs"
              className="group inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-slate-800"
            >
              Explore the Program

              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2.2}
              />
            </Link>

          </motion.div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            variants={fadeInUp}
          >
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <CheckCircle2 className="h-5 w-5" />
                </span>

                <span className="text-sm font-medium text-slate-900">
                  {item}
                </span>
              </div>
            ))}
          </motion.div>

        </motion.div>
                {/* RIGHT COLUMN */}

        <motion.div
          className="relative flex items-center justify-center"
          variants={fadeInUp}
        >
          <div className="relative w-full max-w-xl">

            {/* Glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-sky-100 via-white to-indigo-100 blur-3xl opacity-60" />

            <div className="relative rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">

              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-slate-950">
                  Your Learning Journey
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  From business fundamentals to career growth.
                </p>
              </div>

              <div className="relative">

                {/* Timeline */}

                <div className="absolute left-5 top-4 bottom-4 w-[2px] bg-gradient-to-b from-sky-500 via-indigo-500 to-sky-500" />

                {journey.map((step, index) => {

                  const finalStep = step === "Career Growth";

                  return (

                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.08,
                        duration: 0.4,
                      }}
                      className="relative mb-5 flex items-center gap-5"
                    >

                      <div
                        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold shadow-lg ${
                          finalStep
                            ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white"
                            : "bg-slate-950 text-white"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div
                        className={`flex-1 rounded-2xl px-5 py-4 transition duration-300 ${
                          finalStep
                            ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-xl"
                            : "border border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-white hover:shadow-md"
                        }`}
                      >
                        <p
                          className={`font-medium ${
                            finalStep
                              ? "text-white"
                              : "text-slate-900"
                          }`}
                        >
                          {step}
                        </p>
                      </div>

                    </motion.div>

                  );
                })}

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </motion.section>

  );
}