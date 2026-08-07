import {
  Award,
  BarChart3,
  Bot,
  Cpu,
  Database,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

export type Program = {
  name: string;
  icon: LucideIcon;
  desc: string;
  tags: string[];
};

export const PROGRAMS: Program[] = [
  {
    name: "Data Analytics",
    icon: BarChart3,
    desc: "Learn to collect, clean and visualize data so it drives real decisions — from raw spreadsheets to dashboards stakeholders actually use.",
    tags: ["Programming", "Statistics", "Visualization", "Business context"],
  },
  {
    name: "Business Analytics",
    icon: TrendingUp,
    desc: "Translate data into business strategy — spotting the trend behind the numbers and turning it into a decision leadership can act on.",
    tags: ["Statistics", "Visualization", "Business context"],
  },
  {
    name: "Applied AI",
    icon: Sparkles,
    desc: "Apply existing AI models to real products — integrating, evaluating and shipping AI features rather than building models from scratch.",
    tags: ["Programming", "Statistics", "ML / AI"],
  },
  {
    name: "Agentic AI",
    icon: Bot,
    desc: "Build autonomous, tool-using agents that plan and act across multiple steps — the newest layer of applied AI work.",
    tags: ["Programming", "ML / AI"],
  },
  {
    name: "Machine Learning",
    icon: Cpu,
    desc: "Model and predict from data at scale — the statistics and engineering behind systems that learn from examples.",
    tags: ["Programming", "Statistics", "ML / AI"],
  },
  {
    name: "Data Science",
    icon: Database,
    desc: "Full-stack analysis, from data to insight — the broadest track, covering programming, statistics, visualization and ML together.",
    tags: ["Programming", "Statistics", "Visualization", "ML / AI"],
  },
];

export type Step = {
  title: string;
  short: string;
  detail: string;
  icon: LucideIcon;
};

export const STEPS: Step[] = [
  {
    title: "Batch formation",
    short: "Learners are grouped into cohorts by program and start date.",
    detail:
      "Cohorts are kept small so mentors can track everyone's progress individually, not just teach to the room.",
    icon: Users,
  },
  {
    title: "Live classes",
    short: "Each cohort attends live sessions taught by mentors, on schedule.",
    detail:
      "Real-time, not pre-recorded — you can ask questions as the concept is being taught, not days later.",
    icon: Video,
  },
  {
    title: "Mentor-led practice",
    short: "Mentors guide learners through applied projects between sessions.",
    detail:
      "Between live sessions, mentors review your applied work directly rather than leaving you to self-check.",
    icon: Target,
  },
  {
    title: "Certification & placement",
    short: "Graduates are certified and supported through our partners.",
    detail:
      "Completion earns a certificate, and our industry connect helps put it in front of the right hiring teams.",
    icon: Award,
  },
];

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "What does CareerZeta teach?",
    a: "Six mentor-led programs — Data Analytics, Business Analytics, Applied AI, Agentic AI, Machine Learning and Data Science — built for early-career and working professionals.",
  },
  {
    q: "How are classes run?",
    a: "In live batches. Learners are grouped into cohorts by program and start date, and attend real-time sessions taught by mentors.",
  },
  {
    q: "Are the mentors real industry practitioners?",
    a: "Yes. Mentors work in the industry today and guide learners through applied projects between sessions.",
  },
  {
    q: "Do I get a certificate?",
    a: "Every completed program is certified.",
  },
  {
    q: "Is there support finding a job afterward?",
    a: "Graduates are supported in exploring career opportunities through our industry partners.",
  },
];

/** Single source of truth for contact details shown across the site. */
export const CONTACT = {
  email: "hello@careerzeta.com",
  web: "www.careerzeta.com",
};
