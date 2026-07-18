"use client";

import { motion } from "framer-motion";
import {
  Monitor,
  Globe2,
  Building2,
  BarChart3,
  Sparkles,
  CircleHelp,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface Era {
  id: string;
  year: string;
  technology: string;
  business: string;
  skills: string;
  sentence: string;
  icon: LucideIcon;
  isCurrent?: boolean;
  isFuture?: boolean;
}

const eras: Era[] = [
  {
    id: "1980s",
    year: "1980s",
    technology: "Personal Computers",
    business: "Digital Operations",
    skills: "Computer Literacy",
    sentence: "The desktop computer moved work from paper to screens.",
    icon: Monitor,
  },
  {
    id: "1990s",
    year: "1990s",
    technology: "Internet",
    business: "Connected Businesses",
    skills: "Digital Communication",
    sentence: "The internet connected businesses beyond their walls.",
    icon: Globe2,
  },
  {
    id: "2000s",
    year: "2000s",
    technology: "Enterprise Software",
    business: "Integrated Business Processes",
    skills: "Business Systems & ERP",
    sentence: "Enterprise software connected every business function.",
    icon: Building2,
  },
  {
    id: "2010s",
    year: "2010s",
    technology: "Cloud & Data",
    business: "Data-driven Organizations",
    skills: "Business Analytics",
    sentence: "Data became the foundation of better decisions.",
    icon: BarChart3,
  },
  {
    id: "today",
    year: "Today",
    technology: "Artificial Intelligence",
    business: "Intelligent Enterprises",
    skills: "AI + Business Judgment",
    sentence: "AI is redefining how every professional works.",
    icon: Sparkles,
    isCurrent: true,
  },
  {
    id: "future",
    year: "Tomorrow",
    technology: "",
    business: "Thinking of building capabilities based on the evolving environment.",
    skills: "CareeZeta will help you build it.",
    sentence: "",
    icon: CircleHelp,
    isFuture: true,
  },
];

function EraPanel({ era }: { era: Era }) {
  const Icon = era.icon;

  return (
    <div className="w-[82vw] max-w-5xl shrink-0 snap-center">

      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35 }}
        className="rounded-[32px] border border-slate-200 bg-white p-12 shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
      >

        <span
          className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em]
          ${
            era.isCurrent
              ? "bg-emerald-50 text-emerald-700"
              : era.isFuture
              ? "bg-slate-100 text-slate-500"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {era.year}
        </span>

        <div className="mt-10 flex items-center gap-5">

          <div
            className={`flex h-20 w-20 items-center justify-center rounded-3xl
            ${
              era.isFuture
                ? "bg-slate-100"
                : "bg-gradient-to-br from-sky-500 to-indigo-600"
            }`}
          >
            <Icon
              className={`h-10 w-10 ${
                era.isFuture ? "text-slate-500" : "text-white"
              }`}
            />
          </div>

          <div>

            {era.technology && (
              <h3 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {era.technology}
                </h3>
              )}
            
            <p className="mt-3 text-xl font-medium text-slate-500">
              {era.business}
              
            </p>

          </div>

        </div>

        <p
          className={`mt-8 text-2xl font-semibold
          ${
            era.isCurrent || era.isFuture
              ? "text-emerald-600"
              : "text-sky-600"
          }`}
        >
          {era.skills}
        </p>

        {era.sentence && (
          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
            {era.sentence}
          </p>
        )}

      </motion.div>

    </div>
  );
}
export default function EvolutionJourney() {
  return (
    <section className="overflow-hidden bg-white">

      {/* Hero */}
      <div className="relative px-6 pt-24 pb-20 md:px-10 lg:px-16">

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

        <div className="relative mx-auto max-w-3xl text-center">

          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700 shadow-sm ring-1 ring-slate-200/70">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            The Bigger Picture
          </span>

          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Every Technological Revolution{" "}
            <span className="bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-600 bg-clip-text text-transparent">
              Changed the Way We Work
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Technology has continuously reshaped industries.
            Every transformation changed the capabilities
            businesses looked for in professionals.
          </p>

        </div>

      </div>

      {/* Desktop Horizontal Journey */}

      <div className="hidden md:block">

        <div
          className="
            flex
            snap-x
            snap-mandatory
            gap-10
            overflow-x-auto
            scroll-smooth
            px-[9vw]
            pb-20

            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >

          {eras.map((era) => (

            <EraPanel
              key={era.id}
              era={era}
            />

          ))}

        </div>

      </div>

      {/* Mobile */}

      <div className="pb-16 md:hidden">

        <div
          className="
            flex
            snap-x
            snap-mandatory
            gap-6
            overflow-x-auto
            scroll-smooth
            px-6

            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >

          {eras.map((era) => (

            <div
              key={era.id}
              className="w-[90vw] shrink-0 snap-center"
            >

              <EraPanel era={era} />

            </div>

          ))}

        </div>

      </div>
            {/* Closing Section */}

      <div className="relative px-6 pb-24 md:px-10 lg:px-16">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-8 py-16 text-center shadow-[0_30px_80px_rgba(15,23,42,0.15)] sm:px-16"
        >

          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-sky-500 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-indigo-500 blur-3xl" />
          </div>

          <div className="relative z-10">

            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white">
              CareerZeta
            </span>

            <h3 className="mx-auto mt-8 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              The next technological revolution has already begun.
            </h3>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              The professionals who continue learning will build tomorrow's businesses.
              CareerZeta exists to help you stay ahead of that change.
            </p>

            <button
              className="
                group
                mt-10
                inline-flex
                items-center
                gap-2
                rounded-2xl
                bg-white
                px-8
                py-4
                text-base
                font-semibold
                text-slate-950
                transition
                hover:bg-slate-100
              "
            >
              Discover Our Programs

              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                strokeWidth={2.2}
              />

            </button>

          </div>

        </motion.div>

      </div>

    </section>
  );
}