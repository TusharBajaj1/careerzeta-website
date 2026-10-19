import type { PROGRAMS } from "@/lib/content";

export type ProgramTag = (typeof PROGRAMS)[number]["name"];

export type Story = {
  tags: ProgramTag[];
  title: string;
  description: string;
  source: string;
  url: string;
  image: string;
  imagePosition?: "top" | "center";
  isNew?: boolean;
};

/**
 * Launch library approved in the content brief. These link out to the
 * original publisher rather than reproducing their reporting — do not add
 * more without an equally credible, externally-published source.
 */
export const STORIES: Story[] = [
  {
    tags: ["Generative & Agentic AI"],
    title: "How KPN is building an agentic AI engine for customer care",
    description:
      "KPN and McKinsey's QuantumBlack built an in-house network of specialized AI agents to handle the Dutch telecom's roughly five million customer calls a year — covering verification, order status, appointments and troubleshooting — while keeping humans in the loop at key moments.",
    source: "McKinsey",
    url: "https://www.mckinsey.com/industries/technology-media-and-telecommunications/how-we-help-clients/how-kpn-is-building-an-agentic-ai-engine-for-customer-care",
    image: "/resources/kpn-customer-care.jpg",
    isNew: true,
  },
  {
    tags: ["Business Analytics & Agentic AI"],
    title: "Reinventing pricing and promotion with agentic AI",
    description:
      "A leading beverage company partnered with BCG on an agentic revenue-growth-management platform for pricing and promotion, paired with a redesigned operating model — delivering €150m in gross profit uplift and 2-3% net sales growth.",
    source: "BCG",
    url: "https://www.bcg.com/x/mark-your-moment/reinventing-pricing-and-promotion-with-agentic-ai",
    image: "/resources/bcg-pricing-promotion.jpg",
    isNew: true,
  },
  {
    tags: ["Data Analytics & Agentic AI"],
    title: "How an iron ore producer modernized mining operations with AI",
    description:
      "Rio Tinto worked with BCG X to replace aging scheduling systems with an AI-driven platform combining machine learning and real-time data — helping 50 schedulers make better rail and port decisions, more than doubling productivity, and paying back the investment in under three months.",
    source: "BCG",
    url: "https://www.bcg.com/x/mark-your-moment/how-an-iron-ore-producer-modernized-mining-operations-with-ai",
    image: "/resources/bcg-iron-ore.webp",
    isNew: true,
  },
  {
    tags: ["PG Program in Data Science & AI"],
    title: "Modernizing a 100-year-old business model with AI",
    description:
      "The American Arbitration Association, under CEO Bridget McCormack, worked with McKinsey's QuantumBlack to build an AI-native approach to case management — projecting at least 20% faster case resolution, 35%+ cost savings, and a goal of tenfold caseload capacity.",
    source: "McKinsey",
    url: "https://www.mckinsey.com/capabilities/quantumblack/how-we-help-clients/modernizing-a-100-year-old-business-model-with-ai",
    image: "/resources/mckinsey-100-year-business.jpg",
    isNew: true,
  },
  {
    tags: ["Data Analytics & Agentic AI", "Business Analytics & Agentic AI"],
    title:
      "How a steel plant in India tapped the value of data—and won global acclaim",
    description:
      "Tata Steel's Kalinganagar plant used data and analytics to improve performance, with employee upskilling as part of the transformation.",
    source: "McKinsey",
    url: "https://www.mckinsey.com/industries/metals-and-mining/how-we-help-clients/how-a-steel-plant-in-india-tapped-the-value-of-data-and-won-global-acclaim",
    image: "/resources/tata-steel.jpg",
  },
  {
    tags: ["Data Analytics & Agentic AI", "Business Analytics & Agentic AI"],
    title: "Major retailer uses analytics to improve digital shopping experience",
    description:
      "A case study collection showing how analytics can be applied directly to customer and commercial decisions.",
    source: "Deloitte",
    url: "https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/ai-use-cases.html",
    image: "/resources/deloitte-retail.jpg",
  },
  {
    tags: ["Generative & Agentic AI"],
    title: "Banking on innovation: How ING uses generative AI to put people first",
    description:
      "A practical example of a bank using generative AI to build a customer-facing application.",
    source: "McKinsey",
    url: "https://www.mckinsey.com/industries/financial-services/how-we-help-clients/banking-on-innovation-how-ing-uses-generative-ai-to-put-people-first",
    image: "/resources/ing.svg",
    imagePosition: "top",
  },
  {
    tags: ["Generative & Agentic AI"],
    title: "Aviva: Rewiring the insurance claims journey with AI",
    description:
      "An example of AI applied to an existing business process rather than as a standalone technology experiment.",
    source: "McKinsey",
    url: "https://www.mckinsey.com/capabilities/tech-and-ai/how-we-help-clients/rewired-in-action/aviva-rewiring-the-insurance-claims-journey-with-ai",
    image: "/resources/aviva.jpg",
  },
  {
    tags: ["Generative & Agentic AI"],
    title: "When AI becomes part of the workflow: Redesigning how software gets built",
    description:
      "AI moving from an individual productivity tool into an integrated workflow — a relevant example for agentic, multi-step AI work.",
    source: "McKinsey",
    url: "https://www.mckinsey.com/capabilities/mckinsey-technology/overview/when-ai-becomes-part-of-the-workflow-redesigning-how-software-gets-built",
    image: "/resources/ai-workflow.jpg",
  },
  {
    tags: ["PG Program in Data Science & AI"],
    title: "A world record for Formula E, propelled by McKinsey's AI",
    description:
      "AI applied to performance optimisation in a highly technical, real-time environment.",
    source: "McKinsey",
    url: "https://www.mckinsey.com/about-us/new-at-mckinsey-blog/a-new-world-record-for-formula-e-propelled-by-mckinseys-ai",
    image: "/resources/formula-e.jpg",
  },
];

export type Report = {
  title: string;
  organisation: string;
  year: string;
  description: string;
  url: string;
  image: string;
  featured?: boolean;
  isNew?: boolean;
};

export const REPORTS: Report[] = [
  {
    title: "India's AI Advantage is Human — Work Trend Index 2026",
    organisation: "Microsoft",
    year: "2026",
    description:
      "32% of India's AI users are \"Frontier Professionals\" who redesign work around AI agents — double the 16% global average. 78% say AI now enables work that wasn't possible a year ago, and 63% prioritize quality control of AI output.",
    url: "https://news.microsoft.com/source/asia/2026/09/03/indias-ai-advantage-is-human-microsoft-work-trend-index-2026-finds-india-among-the-worlds-leading-frontier-workforces/",
    image: "/resources/microsoft-work-trend-2026.webp",
    featured: true,
    isNew: true,
  },
  {
    title: "India's AI Talent Inflection Point: From Skill Gaps to Competitive Advantage",
    organisation: "NASSCOM",
    year: "2026",
    description:
      "86% of employers say AI has already impacted job roles and responsibilities, with 35% seeing significant redefinition — and nearly all expect their 2026 workforce strategy to center on AI-related or AI-supported roles.",
    url: "https://nasscom.in/knowledge-center/publications/indias-ai-talent-inflection-point-skill-gaps-competitive-advantage",
    image: "/resources/nasscom-ai-talent.webp",
    isNew: true,
  },
  {
    title: "The 2025 AI Index Report",
    organisation: "Stanford HAI",
    year: "2025",
    description:
      "An independent, data-driven view of artificial intelligence from Stanford HAI, covering technical progress, economic influence and societal impact, including how demand for AI skills is changing.",
    url: "https://hai.stanford.edu/ai-index/2025-ai-index-report",
    image: "/resources/ai-index-2025.svg",
  },
  {
    title: "World Development Report 2026: The Promise of Artificial Intelligence",
    organisation: "World Bank",
    year: "2026",
    description:
      "The World Bank's first comprehensive assessment of what AI means for developing economies, and how firms and governments are already using it.",
    url: "https://www.worldbank.org/en/publication/wdr2026",
    image: "/resources/wdr-2026.svg",
  },
  {
    title: "AI Index 2025: State of AI in 10 Charts",
    organisation: "Stanford HAI",
    year: "2025",
    description:
      "Ten charts from the AI Index on a maturing field, improvements in AI optimization and the growing use of the technology.",
    url: "https://hai.stanford.edu/news/ai-index-2025-state-of-ai-in-10-charts",
    image: "/resources/ai-index-10-charts.svg",
  },
];
