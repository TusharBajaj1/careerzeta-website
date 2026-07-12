"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Users,
  Cpu,
  Sparkles,
  TrendingUp,
  BarChart3,
  Radar,
  Briefcase,
  FileText,
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

const featuredReports = [
  {
    icon: Users,
    publisher: "World Economic Forum",
    title: "Future of Jobs Report 2025",
    summary: "Explores emerging jobs, future skills and workforce transformation.",
    year: "2025",
    category: "Future of Work",
    link: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/",
  },
  {
    icon: Cpu,
    publisher: "McKinsey & Company",
    title: "The State of AI",
    summary: "Examines enterprise AI adoption, investment trends and business value.",
    year: "2025",
    category: "AI",
    link: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
  },
  {
    icon: Sparkles,
    publisher: "PwC",
    title: "AI Jobs Barometer",
    summary: "Explores how AI is transforming jobs, productivity and skills.",
    year: "2025",
    category: "AI",
    link: "https://www.pwc.com/gx/en/services/ai/ai-jobs-barometer.html",
  },
  {
    icon: TrendingUp,
    publisher: "Deloitte",
    title: "Tech Trends",
    summary: "Highlights technologies shaping modern enterprises.",
    year: "2026",
    category: "Technology",
    link: "https://www.deloitte.com/us/en/insights/topics/technology-management/tech-trends.html",
  },
  {
    icon: BarChart3,
    publisher: "Gartner",
    title: "Top Strategic Technology Trends",
    summary: "Explains the most important strategic technologies for business leaders.",
    year: "2026",
    category: "Strategy",
    link: "https://www.gartner.com/en/articles/top-technology-trends-2026",
  },
];

const additionalResources = [
  {
    icon: Radar,
    publisher: "BCG",
    title: "AI Radar",
    link: "https://www.bcg.com/publications/2025/bcg-ai-radar",
  },
  {
    icon: Briefcase,
    publisher: "Microsoft",
    title: "Work Trend Index",
    link: "https://www.microsoft.com/en-us/worklab/work-trend-index",
  },
  {
    icon: FileText,
    publisher: "Google Cloud",
    title: "Data Analytics Trends",
    link: "https://cloud.google.com/resources/analytics-trends",
  },
];

export default function ResourcesPage() {
  return (
    <>
      {/* Hero + Featured Reports combined */}
      <motion.section
        className="relative overflow-hidden bg-white px-6 pb-20 pt-16 md:px-10 lg:px-16"
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
            Curated Industry{" "}
            <span className="text-transparent bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-600 bg-clip-text">
              Resources
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl"
            variants={fadeInUp}
          >
            Reports and research from globally recognized organizations like the World Economic
            Forum, McKinsey and Gartner — covering analytics, technology, AI and the future of
            work.
          </motion.p>
        </div>

        <motion.div
          className="relative mx-auto mt-14 max-w-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={cardStagger}
        >
          <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700 shadow-sm ring-1 ring-slate-200/70">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            Featured Reports
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {featuredReports.map((report) => {
              const Icon = report.icon;
              return (
                <motion.div
                  key={report.title}
                  className="group flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_28px_80px_rgba(15,23,42,0.08)]"
                  variants={fadeInUp}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white transition group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-indigo-600">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                        {report.category}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                        {report.year}
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {report.publisher}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
                    {report.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">{report.summary}</p>

                  <div className="mt-6 flex-1" />

                  <div className="mt-6 flex-1" />
                  <a
                  href={report.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-sky-600"
                  >
                    Read Report
                    <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                    strokeWidth={2.25}
                    />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.section>

      {/* Additional Resources */}
      <motion.section
        className="bg-slate-50/60 px-6 py-20 md:px-10 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div className="mx-auto max-w-3xl text-center" variants={fadeInUp}>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Additional{" "}
              <span className="text-transparent bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-600 bg-clip-text">
                Resources
              </span>
            </h2>
          </motion.div>

          <motion.div className="mt-16 grid gap-6 sm:grid-cols-3" variants={cardStagger}>
            {additionalResources.map((item) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.title}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
                  variants={fadeInUp}
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white transition group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-indigo-600">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {item.publisher}
                    </p>
                    <p className="mt-1 text-base font-semibold tracking-tight text-slate-950">
                      {item.title}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        className="bg-white px-6 py-24 md:px-10 lg:px-16"
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
              Stay Ahead of Industry Trends
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg">
              We regularly curate valuable industry reports and learning resources for
              professionals.
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