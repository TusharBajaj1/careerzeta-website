import {
  BarChart3,
  Bot,
  Database,
  Sheet,
  Sparkles,
  Table2,
  type LucideIcon,
} from "lucide-react";
import {
  SiClaude,
  SiGooglegemini,
  SiHuggingface,
  SiJupyter,
  SiLangchain,
  SiNumpy,
  SiPandas,
  SiPython,
  SiPytorch,
  SiScikitlearn,
  SiTensorflow,
} from "react-icons/si";
import type { IconType } from "react-icons";

export type ToolMeta = { icon: LucideIcon | IconType; color: string };

/**
 * Real open-source project marks where one exists (Python, Jupyter, Pandas,
 * NumPy, Scikit-learn, Claude, Gemini, TensorFlow, PyTorch, Hugging Face,
 * LangChain); a colored generic icon everywhere else, since no Excel/Power
 * BI/Tableau/ChatGPT/Copilot mark is available here and fabricating one
 * isn't safe. Rendered identically either way so the mix doesn't show.
 */
const TOOL_META: Record<string, ToolMeta> = {
  Excel: { icon: Sheet, color: "#217346" },
  SQL: { icon: Database, color: "#0369a1" },
  "Power BI": { icon: BarChart3, color: "#F2C811" },
  Tableau: { icon: Table2, color: "#E97627" },
  Python: { icon: SiPython, color: "#3776AB" },
  ChatGPT: { icon: Bot, color: "#10A37F" },
  Claude: { icon: SiClaude, color: "#D97757" },
  Gemini: { icon: SiGooglegemini, color: "#4285F4" },
  "Microsoft Copilot": { icon: Bot, color: "#185ABD" },
  Pandas: { icon: SiPandas, color: "#150458" },
  NumPy: { icon: SiNumpy, color: "#4DABCF" },
  "Scikit-learn": { icon: SiScikitlearn, color: "#F7931E" },
  Jupyter: { icon: SiJupyter, color: "#F37626" },
  TensorFlow: { icon: SiTensorflow, color: "#FF6F00" },
  PyTorch: { icon: SiPytorch, color: "#EE4C2C" },
  "Hugging Face": { icon: SiHuggingface, color: "#FFD21E" },
  LangChain: { icon: SiLangchain, color: "#1C3C3C" },
};

export function toolMeta(tool: string): ToolMeta {
  return TOOL_META[tool] ?? { icon: Sparkles, color: "#0369a1" };
}

/**
 * "What You'll Do" steps are short, program-specific phrases rather than
 * fixed concepts, so there's no single icon per label to map to. A rotating
 * set gives each step a distinct, consistent visual without curating one
 * icon per phrase across all six programs by hand.
 */
export const WHAT_YOULL_DO_ICONS: LucideIcon[] = [
  Database,
  Sparkles,
  BarChart3,
  Bot,
  Sheet,
];

export type ProgramDetail = {
  slug: string;
  number: string;
  question: string;
  context: string;
  reasons: string[];
  level: "Beginner" | "Intermediate" | "Professional";
  prerequisites: string;
  /** From the brochure's "Program at a Glance" — null where no brochure exists yet. */
  duration: string | null;
  whatYoullDo: string[];
  tools: string[];
  toolsNote?: string;
  roles: string[];
  /** No brochures have been supplied yet — null renders a clearly-marked pending state. */
  brochureUrl: string | null;
};

export const PROGRAM_DETAILS: ProgramDetail[] = [
  {
    slug: "data-analytics",
    number: "01",
    question: "Do you want to turn data into answers?",
    context:
      "Does your current role involve Excel, reports, MIS, operations or business data, but you find yourself spending more time preparing data than actually understanding it?",
    reasons: [
      "Develop formal analytics skills.",
      "Prepare for your move from reporting/MIS into an analytics role.",
      "Become stronger at extracting insights from business data.",
      "Start transitioning into the data/analytics field.",
    ],
    level: "Beginner",
    prerequisites: "No prior analytics experience required.",
    duration: "6 months",
    whatYoullDo: [
      "Raw business data",
      "Analyse",
      "Identify patterns",
      "Build dashboards",
      "Communicate insights",
    ],
    tools: ["Excel", "SQL", "Power BI", "Python"],
    roles: [
      "Data Analyst",
      "Reporting Analyst",
      "MIS Analyst",
      "BI Analyst",
    ],
    brochureUrl: "/brochures/careerzeta-data-analytics-brochure.pdf",
  },
  {
    slug: "business-analytics",
    number: "02",
    question: "Do you want to use data to solve business problems?",
    context:
      "Does your current role involve sales, marketing, finance, operations or strategy, but you want to use data more effectively to understand performance and make better business decisions?",
    reasons: [
      "Develop practical business analytics skills.",
      "Learn to translate business problems into data-driven questions.",
      "Strengthen your ability to analyse business performance and identify opportunities.",
      "Prepare for a move into business analysis and analytics-oriented roles.",
      "Use data to support recommendations and business decisions.",
    ],
    level: "Intermediate",
    prerequisites: "Basic familiarity with business processes and spreadsheets.",
    duration: "6 months",
    whatYoullDo: [
      "A business problem",
      "Identify the right data",
      "Analyse it",
      "Generate insights",
      "Recommend action",
    ],
    tools: ["Excel", "SQL", "Power BI", "Tableau", "Python"],
    roles: [
      "Business Analyst",
      "Data Analyst",
      "Business Intelligence Analyst",
      "Marketing Analyst",
      "Financial Analyst",
      "Product Analyst",
      "Operations Analyst",
      "Risk Analyst",
    ],
    brochureUrl: "/brochures/careerzeta-business-analytics-brochure.pdf",
  },
  {
    slug: "data-science",
    number: "03",
    question: "Do you want to build AI systems, from machine learning to agentic AI?",
    context:
      "CareerZeta's Data Science & AI Professional Program takes you from data analytics through machine learning and deep learning to generative and agentic AI — so you can build, deploy and govern AI systems end to end.",
    reasons: [
      "Develop end-to-end AI capabilities — from data analytics through machine learning and deep learning to generative and agentic AI.",
      "Learn to deploy, monitor and improve models in production, not just prototype them.",
      "Go beyond using AI tools to building LLM apps, RAG systems and AI agents that do real work.",
      "Prepare for a career ladder from Data Scientist or ML Engineer toward Senior Data Scientist, AI Engineer and Head of AI.",
      "Build a portfolio of real-world projects and an end-to-end AI capstone.",
    ],
    level: "Professional",
    prerequisites: "Basic Python recommended. No prior machine-learning experience required.",
    duration: "12 months",
    whatYoullDo: [
      "Data & analytics foundations",
      "Statistics & machine learning",
      "Deep learning",
      "Generative AI",
      "Agentic AI immersion",
      "Deploy & present",
    ],
    tools: ["Python", "TensorFlow", "PyTorch", "Hugging Face", "LangChain"],
    roles: [
      "Data Scientist",
      "ML Engineer",
      "AI Engineer",
      "Applied Data Scientist",
    ],
    brochureUrl: "/brochures/careerzeta-data-science-ai-brochure.pdf",
  },
  {
    slug: "applied-ai",
    number: "04",
    question: "Do you want to bring AI into your current job?",
    context:
      "Are you a working professional who sees AI changing your industry, but you're not sure how to apply it meaningfully to the work you already do?",
    reasons: [
      "Develop practical AI skills for your current role.",
      "Learn how to identify tasks and workflows where AI can add value.",
      "Use AI to improve research, analysis, content, reporting and productivity.",
      "Build confidence in working with modern AI tools.",
      "Prepare yourself for an increasingly AI-enabled workplace.",
    ],
    level: "Intermediate",
    prerequisites: "No prior AI experience required.",
    duration: null,
    whatYoullDo: [
      "A professional task",
      "Identify where AI can help",
      "Use the right AI approach",
      "Build a practical workflow",
      "Improve the outcome",
    ],
    tools: ["ChatGPT", "Claude", "Gemini", "Microsoft Copilot"],
    toolsNote: "Final tool list to be aligned with the actual curriculum.",
    roles: [
      "Consulting",
      "Marketing",
      "Finance",
      "HR",
      "Operations",
      "Product",
      "Business Functions",
    ],
    brochureUrl: null,
  },
  {
    slug: "agentic-ai",
    number: "05",
    question: "Do you want AI to do more than just answer your questions?",
    context:
      "Are you already experimenting with generative AI, but want to move beyond prompting and one-off interactions towards AI systems that can perform multi-step tasks and workflows?",
    reasons: [
      "Understand how AI agents work and how they differ from conventional AI tools.",
      "Learn to design AI-powered workflows for complex tasks.",
      "Move from simply using AI tools to building AI-enabled solutions.",
      "Understand how AI agents can interact with tools, information and workflows.",
      "Develop skills relevant to the next generation of AI applications.",
    ],
    level: "Professional",
    prerequisites: "Basic familiarity with Generative AI is recommended.",
    duration: null,
    whatYoullDo: [
      "A complex workflow",
      "Break it into tasks",
      "Connect AI with tools and information",
      "Build an agentic workflow",
      "Evaluate the outcome",
    ],
    tools: [],
    toolsNote:
      "To be finalised based on the actual curriculum — specific agent frameworks aren't listed until confirmed.",
    roles: [
      "AI Automation",
      "AI Solutions",
      "AI Product",
      "AI-enabled Operations",
      "AI Engineering",
    ],
    brochureUrl: null,
  },
  {
    slug: "machine-learning",
    number: "06",
    question: "Do you want to build the models behind intelligent systems?",
    context:
      "Do you have an analytical, technical or quantitative background and want to move beyond using AI tools to understand how machines learn from data and make predictions?",
    reasons: [
      "Develop practical machine-learning skills.",
      "Learn how predictive models are built and evaluated.",
      "Strengthen your Python and data-modelling capabilities.",
      "Prepare for a transition towards machine-learning and technically oriented data roles.",
      "Apply machine learning to real-world datasets and problems.",
    ],
    level: "Professional",
    prerequisites:
      "Basic statistics and quantitative reasoning. Basic Python knowledge recommended.",
    duration: null,
    whatYoullDo: [
      "Data",
      "Prepare it",
      "Identify relevant features",
      "Build models",
      "Evaluate predictions",
      "Apply to a real-world problem",
    ],
    tools: ["Python", "Pandas", "NumPy", "Scikit-learn", "Jupyter"],
    roles: [
      "Machine Learning Engineer",
      "ML Analyst",
      "Applied ML Professional",
      "Data Scientist",
    ],
    brochureUrl: null,
  },
];

export type OperateStep = {
  number: string;
  title: string;
  detail: string;
};

export const PROGRAMS_HOW_WE_OPERATE: OperateStep[] = [
  {
    number: "01",
    title: "Registration",
    detail: "Sign up for the program that fits where you want to go.",
  },
  {
    number: "02",
    title: "Batch Formation",
    detail: "Learners are grouped into a cohort by program and start date.",
  },
  {
    number: "03",
    title: "Live Classes",
    detail: "Attend real-time sessions taught by mentors, on schedule.",
  },
  {
    number: "04",
    title: "Assessment",
    detail: "Applied work is assessed to check the skill has actually landed.",
  },
  {
    number: "05",
    title: "Certification",
    detail: "Completing the program earns your certificate.",
  },
  {
    number: "06",
    title: "Placement Support",
    detail:
      "Our industry connect helps put your new skills in front of the right people.",
  },
];
