import {
  Award,
  BarChart3,
  Bot,
  Database,
  Landmark,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

export type Program = {
  slug: string;
  name: string;
  icon: LucideIcon;
  desc: string;
  tags: string[];
};

/** Serializable subset for Client Components — Program's `icon` is a
 * function and can't cross the server/client boundary as a prop. */
export type ProgramSummary = Pick<Program, "slug" | "name">;

/** slug is the anchor id each program links to on /programs (#slug). */
export const PROGRAMS: Program[] = [
  {
    slug: "data-analytics",
    name: "Data Analytics & Agentic AI",
    icon: BarChart3,
    desc: "Learn to collect, clean and visualize data so it drives real decisions — from raw spreadsheets to dashboards stakeholders actually use.",
    tags: ["Programming", "Statistics", "Visualization", "Business context"],
  },
  {
    slug: "business-analytics",
    name: "Business Analytics & Agentic AI",
    icon: TrendingUp,
    desc: "Translate data into business strategy — spotting the trend behind the numbers and turning it into a decision leadership can act on.",
    tags: ["Programming", "Statistics", "Visualization", "Business context"],
  },
  {
    slug: "data-science",
    name: "PG Program in Data Science & AI",
    icon: Database,
    desc: "Go from data analytics through machine learning and deep learning to generative and agentic AI — building, deploying and governing AI systems end to end.",
    tags: ["Programming", "Statistics", "Visualization", "ML / AI"],
  },
  {
    slug: "generative-agentic-ai",
    name: "Generative & Agentic AI",
    icon: Bot,
    desc: "Move beyond prompting to building — retrieval-augmented systems and autonomous agents that plan, reason and act using today's leading AI frameworks.",
    tags: ["Programming", "ML / AI"],
  },
  {
    slug: "investment-banking",
    name: "Investment Banking with AI immersion",
    icon: Landmark,
    desc: "Build the financial modeling, valuation and deal skills behind investment banking, equity research and private equity roles.",
    tags: ["Business context", "Visualization"],
  },
  {
    slug: "cyber-security",
    name: "Cybersecurity with AI immersion",
    icon: ShieldCheck,
    desc: "Learn to defend networks and systems — from Linux and networking foundations to ethical hacking and incident response.",
    tags: ["Programming", "Business context"],
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
    a: "Six mentor-led programs — Data Analytics, Business Analytics, Data Science & AI, Generative and Agentic AI, Investment Banking and Cyber Security — built for early-career and working professionals.",
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
  phone: "+91-8851441177",
  web: "www.careerzeta.com",
  talentEmail: "talent@careerzeta.com",
  address:
    "Innov8, Upper Ground Floor, Tower-2, Graphix, A-13, Sector 62, Noida, Uttar Pradesh 201301",
  mapUrl: "https://share.google/yga5HK2BSWGuFIjGY",
  whatsapp: "https://wa.me/message/TV5NDL2D6UI3B1",
  linkedin: "https://www.linkedin.com/company/careerzeta-learning-pvt-ltd/",
  instagram: "https://www.instagram.com/careerzeta_learning/",
};

/**
 * External, independently-sourced statistic used in the Hero. Not a
 * CareerZeta claim — kept separate and always rendered with attribution.
 * The `url` is background research only (not rendered on the site) in
 * case the figure is ever questioned.
 */
export const EXTERNAL_STAT = {
  headline: "Upskilling can improve remuneration by up to 40%.",
  source: "EY Future of Pay 2026 report",
  url: "https://economictimes.indiatimes.com/jobs/hr-policies-trends/pay-hikes-ease-to-9-1-in-2026-as-firms-focus-on-skill-based-rewards-ey-report/articleshow/128703168.cms",
};
