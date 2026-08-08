import { PROGRAMS } from "@/lib/content";

export type ProgramTag = (typeof PROGRAMS)[number]["name"];

export type Story = {
  tags: ProgramTag[];
  title: string;
  description: string;
  source: string;
  url: string;
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
  },
  {
    tags: ["Data Analytics", "Business Analytics"],
    title: "Major retailer uses analytics to improve digital shopping experience",
    description:
      "A case study collection showing how analytics can be applied directly to customer and commercial decisions.",
    source: "Deloitte",
    url: "https://www2.deloitte.com/us/en/pages/deloitte-analytics/articles/business-analytics-case-studies.html",
  },
  {
    tags: ["Applied AI"],
    title: "Banking on innovation: How ING uses generative AI to put people first",
    description:
      "A practical example of a bank using generative AI to build a customer-facing application.",
    source: "McKinsey",
    url: "https://www.mckinsey.com/industries/financial-services/how-we-help-clients/banking-on-innovation-how-ing-uses-generative-ai-to-put-people-first",
  },
  {
    tags: ["Applied AI"],
    title: "Aviva: Rewiring the insurance claims journey with AI",
    description:
      "An example of AI applied to an existing business process rather than as a standalone technology experiment.",
    source: "McKinsey",
    url: "https://www.mckinsey.com/capabilities/tech-and-ai/how-we-help-clients/rewired-in-action/aviva-rewiring-the-insurance-claims-journey-with-ai",
  },
  {
    tags: ["Agentic AI"],
    title: "When AI becomes part of the workflow: Redesigning how software gets built",
    description:
      "AI moving from an individual productivity tool into an integrated workflow — a relevant example for agentic, multi-step AI work.",
    source: "McKinsey",
    url: "https://www.mckinsey.com/capabilities/mckinsey-technology/overview/when-ai-becomes-part-of-the-workflow-redesigning-how-software-gets-built",
  },
  {
    tags: ["Machine Learning", "Data Science"],
    title: "A world record for Formula E, propelled by McKinsey's AI",
    description:
      "AI applied to performance optimisation in a highly technical, real-time environment.",
    source: "McKinsey",
    url: "https://www.mckinsey.com/about-us/new-at-mckinsey-blog/a-new-world-record-for-formula-e-propelled-by-mckinseys-ai",
  },
  {
    tags: ["Machine Learning", "Data Science"],
    title:
      "Global insurer embraces advanced analytics to improve predictability and service",
    description:
      "A case study collection on advanced analytics being used in an industry setting.",
    source: "Deloitte",
    url: "https://www2.deloitte.com/us/en/pages/deloitte-analytics/articles/business-analytics-case-studies.html",
  },
];

export type Report = {
  title: string;
  organisation: string;
  year: string;
  description: string;
  url: string;
  featured?: boolean;
};

export const REPORTS: Report[] = [
  {
    title: "The Future of Jobs Report 2025",
    organisation: "World Economic Forum",
    year: "2025",
    description:
      "Drawing on responses from more than 1,000 employers, this identifies AI, big data and other technology skills among the fastest-growing areas through 2030 — and the scale of reskilling that will require.",
    url: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/",
    featured: true,
  },
  {
    title: "The jobs of the future — and the skills you need to get them",
    organisation: "World Economic Forum",
    year: "2025",
    description:
      "A more accessible read than the full report, on the growing importance of AI, big data and technological literacy.",
    url: "https://www.weforum.org/stories/2025/01/future-of-jobs-report-2025-jobs-of-the-future-and-the-skills-you-need-to-get-them/",
  },
  {
    title: "These are the fastest growing and declining jobs",
    organisation: "World Economic Forum",
    year: "2025",
    description:
      "A short, visual introduction to how technology is changing the employment landscape through 2030.",
    url: "https://www.weforum.org/stories/2025/01/future-of-jobs-report-2025-the-fastest-growing-and-declining-jobs/",
  },
];
