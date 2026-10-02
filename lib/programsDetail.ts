export type ProgramDetail = {
  slug: string;
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
  /** Null renders "Fee on request" until pricing for this program is confirmed. */
  fee: string | null;
};

export const PROGRAM_DETAILS: ProgramDetail[] = [
  {
    slug: "data-analytics",
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
    fee: "₹1,05,000",
  },
  {
    slug: "business-analytics",
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
    fee: "₹1,05,000",
  },
  {
    slug: "data-science",
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
    fee: "₹1,65,000",
  },
  {
    slug: "generative-agentic-ai",
    question: "Do you want to build with the AI that's reshaping software?",
    context:
      "Are you already using generative AI tools, but want to move beyond prompting to building retrieval-augmented systems and autonomous agents that plan, reason and act?",
    reasons: [
      "Learn prompt engineering and retrieval-augmented generation (RAG) to ground models in real data.",
      "Understand the agentic patterns behind AI that plans, reasons and acts across multiple steps.",
      "Connect agents to APIs, databases and external tools rather than just chat interfaces.",
      "Learn evaluation and guardrails so AI systems are reliable, not just impressive in a demo.",
      "Prepare for roles building and shipping production AI applications, not just using them.",
    ],
    level: "Professional",
    prerequisites:
      "Basic Python recommended. Familiarity with generative AI tools is helpful but not required.",
    duration: null,
    whatYoullDo: [
      "Prompting foundations",
      "Retrieval-augmented generation",
      "Agent design & orchestration",
      "Tool & API integration",
      "Evaluation & guardrails",
      "Deploy & present",
    ],
    tools: ["Python", "LangChain", "LangGraph", "Vector databases", "OpenAI API"],
    roles: [
      "Generative AI Engineer",
      "AI Agent Developer",
      "LLM Application Engineer",
      "AI Product Engineer",
    ],
    brochureUrl: null,
    fee: null,
  },
  {
    slug: "investment-banking",
    question: "Do you want to break into investment banking?",
    context:
      "Do you want to move into roles in investment banking, equity research or private equity, but need the financial modeling, valuation and deal skills a typical finance degree doesn't teach?",
    reasons: [
      "Develop financial modeling and valuation skills — DCF, comparable companies, precedent transactions and LBO analysis.",
      "Learn the M&A and IPO process end to end, the way it's actually run on a deal team.",
      "Build pitchbooks and investor-ready presentations, not just spreadsheets.",
      "Work through case studies and live deal simulations for real job readiness.",
      "Prepare for analyst roles at investment banks, PE firms and boutique advisories — foundation modules included for non-finance backgrounds.",
    ],
    level: "Intermediate",
    prerequisites:
      "Basic understanding of accounting and finance recommended. Foundation modules available for non-finance backgrounds.",
    duration: null,
    whatYoullDo: [
      "Accounting & financial statement foundations",
      "Financial modeling",
      "Valuation: DCF, comps & precedents",
      "M&A & LBO modeling",
      "Pitchbook & presentation",
      "Capstone deal simulation",
    ],
    tools: ["Excel", "VBA", "PowerPoint", "Bloomberg Terminal"],
    roles: [
      "Investment Banking Analyst",
      "Equity Research Analyst",
      "M&A Analyst",
      "Private Equity Analyst",
    ],
    brochureUrl: null,
    fee: "₹1,05,000",
  },
  {
    slug: "cyber-security",
    question: "Do you want to defend systems against real-world threats?",
    context:
      "Are you curious about how systems actually get breached, and want to build the skills to defend them — from networks and Linux fundamentals to ethical hacking and incident response?",
    reasons: [
      "Develop practical cybersecurity skills from the ground up — no prior experience assumed.",
      "Learn networking, Linux and system administration fundamentals.",
      "Practice ethical hacking and incident response in hands-on labs.",
      "Prepare for the CompTIA Security+ certification.",
      "Build the skills to move into SOC analyst and security engineering roles.",
    ],
    level: "Beginner",
    prerequisites: "No prior cybersecurity experience required.",
    duration: null,
    whatYoullDo: [
      "Networking & Linux foundations",
      "System & security administration",
      "Ethical hacking",
      "Incident response",
      "SIEM & monitoring",
      "Apply to a real-world scenario",
    ],
    tools: ["Linux", "Wireshark", "Nmap", "Metasploit", "Splunk"],
    roles: [
      "SOC Analyst",
      "Cybersecurity Analyst",
      "Penetration Tester",
      "Security Engineer",
    ],
    brochureUrl: null,
    fee: "₹1,05,000",
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
