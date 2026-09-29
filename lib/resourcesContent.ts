import type { PROGRAMS } from "@/lib/content";

export type ProgramTag = (typeof PROGRAMS)[number]["name"];

export type Story = {
  tags: ProgramTag[];
  title: string;
  description: string;
  source: string;
  url: string;
  /** Path under /public once a real photo is supplied — null renders a pending placeholder. */
  image: string | null;
  imagePosition?: "top" | "center";
};

/**
 * Launch library approved in the content brief. These link out to the
 * original publisher rather than reproducing their reporting — do not add
 * more without an equally credible, externally-published source.
 */
export const STORIES: Story[] = [
  {
    tags: ["Data Analytics", "Business Analytics"],
    title:
      "How a steel plant in India tapped the value of data—and won global acclaim",
    description:
      "Tata Steel's Kalinganagar plant used data and analytics to improve performance, with employee upskilling as part of the transformation.",
    source: "McKinsey",
    url: "https://www.mckinsey.com/industries/metals-and-mining/how-we-help-clients/how-a-steel-plant-in-india-tapped-the-value-of-data-and-won-global-acclaim",
    image: "/resources/tata-steel.jpg",
  },
  {
    tags: ["Data Analytics", "Business Analytics"],
    title: "Major retailer uses analytics to improve digital shopping experience",
    description:
      "A case study collection showing how analytics can be applied directly to customer and commercial decisions.",
    source: "Deloitte",
    url: "https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/ai-use-cases.html",
    image: "/resources/deloitte-retail.jpg",
  },
  {
    tags: ["Applied AI"],
    title: "Banking on innovation: How ING uses generative AI to put people first",
    description:
      "A practical example of a bank using generative AI to build a customer-facing application.",
    source: "McKinsey",
    url: "https://www.mckinsey.com/industries/financial-services/how-we-help-clients/banking-on-innovation-how-ing-uses-generative-ai-to-put-people-first",
    image: "/resources/ing.jpg",
  },
  {
    tags: ["Applied AI"],
    title: "Aviva: Rewiring the insurance claims journey with AI",
    description:
      "An example of AI applied to an existing business process rather than as a standalone technology experiment.",
    source: "McKinsey",
    url: "https://www.mckinsey.com/capabilities/tech-and-ai/how-we-help-clients/rewired-in-action/aviva-rewiring-the-insurance-claims-journey-with-ai",
    image: null,
  },
  {
    tags: ["Agentic AI"],
    title: "When AI becomes part of the workflow: Redesigning how software gets built",
    description:
      "AI moving from an individual productivity tool into an integrated workflow — a relevant example for agentic, multi-step AI work.",
    source: "McKinsey",
    url: "https://www.mckinsey.com/capabilities/mckinsey-technology/overview/when-ai-becomes-part-of-the-workflow-redesigning-how-software-gets-built",
    image: "/resources/ai-workflow.jpg",
  },
  {
    tags: ["Machine Learning", "Data Science & AI"],
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
  /** Path under /public once cover artwork is supplied — null renders a pending placeholder. */
  image: string | null;
  featured?: boolean;
};

export const REPORTS: Report[] = [
  {
    title: "The 2025 AI Index Report",
    organisation: "Stanford HAI",
    year: "2025",
    description:
      "An independent, data-driven view of artificial intelligence from Stanford HAI, covering technical progress, economic influence and societal impact, including how demand for AI skills is changing.",
    url: "https://hai.stanford.edu/ai-index/2025-ai-index-report",
    image: "/resources/ai-index-2025-cover.jpg",
    featured: true,
  },
  {
    title: "World Development Report 2026: The Promise of Artificial Intelligence",
    organisation: "World Bank",
    year: "2026",
    description:
      "The World Bank's first comprehensive assessment of what AI means for developing economies, and how firms and governments are already using it.",
    url: "https://www.worldbank.org/en/publication/wdr2026",
    image: "/resources/wdr-2026.png",
  },
  {
    title: "AI Index 2025: State of AI in 10 Charts",
    organisation: "Stanford HAI",
    year: "2025",
    description:
      "Ten charts from the AI Index on a maturing field, improvements in AI optimization and the growing use of the technology.",
    url: "https://hai.stanford.edu/news/ai-index-2025-state-of-ai-in-10-charts",
    image: "/resources/ai-index-10-charts.png",
  },
];
