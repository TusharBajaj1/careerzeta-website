"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
};

export default function Hero() {
  return (
    <motion.section
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-white px-6 py-12 md:px-10 lg:px-16"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {/* Background texture */}
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

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.4fr_0.6fr]">
        <motion.div className="flex flex-col justify-center gap-8" variants={fadeInUp}>
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700 shadow-sm ring-1 ring-slate-200/70">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            CareerZeta
          </div>

          <div className="space-y-6">
            <motion.h1
              className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
              variants={fadeInUp}
            >
              Build Your Career in{" "}
              <span className="text-transparent bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-600 bg-clip-text">
                Business Analytics
              </span>
            </motion.h1>

            <motion.p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl" variants={fadeInUp}>
              Industry-led learning designed for professionals looking to transition into Business Analytics
              or accelerate their careers.
            </motion.p>
          </div>

          <motion.div className="flex flex-col gap-4 sm:flex-row" variants={fadeInUp}>
            <button className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-950/15">
              Explore the Program
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.25} />
            </button>
            <button className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50">
              Contact Us
            </button>
          </motion.div>

          <motion.div className="grid gap-4 sm:grid-cols-2" variants={fadeInUp}>
            {[
              "Industry Mentors",
              "Real Business Projects",
              "Career Support",
              "Professional Network",
            ].map((value) => (
              <div
                key={value}
                className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-slate-100/70"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="text-sm font-medium text-slate-900">{value}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="relative flex items-center justify-center" variants={fadeInUp}>
          <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-b from-slate-50 via-white to-slate-100 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.1)]">
            <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="absolute -right-8 bottom-10 h-28 w-28 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative z-10 grid gap-6">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-3.5 w-16 rounded-full bg-slate-200" />
                    <div className="mt-3 h-3 w-24 rounded-full bg-slate-200" />
                  </div>
                  <div className="h-10 w-10 rounded-3xl bg-slate-100" />
                </div>
                <div className="mt-6 grid gap-3">
                  <div className="h-3 rounded-full bg-slate-100" />
                  <div className="h-3 rounded-full bg-slate-100 w-5/6" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950/95 p-4 text-white">
                  <div className="mb-4 h-3.5 w-20 rounded-full bg-slate-700/60" />
                  <div className="space-y-3">
                    <div className="h-3 rounded-full bg-slate-700/60" />
                    <div className="h-3 rounded-full bg-slate-700/60 w-5/6" />
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <div className="mb-4 h-3.5 w-24 rounded-full bg-slate-200" />
                  <div className="space-y-3">
                    <div className="h-3 rounded-full bg-slate-100" />
                    <div className="h-3 rounded-full bg-slate-100 w-4/6" />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-slate-950/95 p-4 text-white">
                  <div className="mb-3 h-3.5 w-16 rounded-full bg-slate-700/60" />
                  <div className="space-y-2">
                    <div className="h-3 rounded-full bg-slate-700/60" />
                    <div className="h-3 rounded-full bg-slate-700/60 w-3/4" />
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-slate-100 p-4">
                  <div className="mb-3 h-3.5 w-20 rounded-full bg-slate-200" />
                  <div className="space-y-2">
                    <div className="h-3 rounded-full bg-slate-200" />
                    <div className="h-3 rounded-full bg-slate-200 w-4/5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-8 bottom-8 flex items-center justify-between rounded-3xl bg-white/90 px-5 py-4 shadow-sm ring-1 ring-slate-200 backdrop-blur">
              <div className="space-y-2">
                <div className="h-3 w-24 rounded-full bg-slate-200" />
                <div className="h-3 w-16 rounded-full bg-slate-200" />
              </div>
              <div className="grid h-14 w-14 place-items-center rounded-3xl bg-slate-950 text-white">
                <span className="text-sm font-semibold">BA</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}