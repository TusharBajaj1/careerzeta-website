/**
 * Structured content for the v4 program detail pages (/programs/[slug]),
 * built from the Claude-design handoff (design_handoff_program_detail_v4).
 * Content is the same brochure-sourced material as the earlier landing-page
 * iteration, reshaped into this page's data contract plus a few genuinely
 * new fields the new design needs: `headline`, `ladder` (career ladder) and
 * `toolGroups` (tools grouped by category instead of one flat list).
 *
 * Named distinctly from lib/programsDetail.ts's `ProgramDetail` (used by
 * the combined /programs overview page) to avoid a type-name collision —
 * this file's export is `ProgramDetailPageData`.
 */

export type ProjectLevel = "Beginner" | "Intermediate" | "Advanced";

export type ProgramDetailPageData = {
  slug: string;
  name: string;
  level?: string;
  duration?: string;
  /** Two-sentence hero headline ("Spend less time X. More time Y Z."), with the middle word in the aqua accent colour. */
  headline: { lead: string; emphasis: string; trail: string };
  intro: string;
  fee: string;
  feeNote?: string;
  heroPhoto: string;
  brochureUrl: string | null;
  syllabusUrl: string | null;
  stats: { value: string; label: string }[];
  why: { title: string; text: string }[];
  /** Career ladder, lowest to highest — 5 rungs. */
  ladder: string[];
  audience: string[];
  phases: { name: string; modules: string[] }[];
  skills: string[];
  toolGroups: { name: string; tools: string[] }[];
  projects: { level: ProjectLevel; title: string; text: string }[];
  capstone: string[];
  caseStudies: { industry: string; title: string; text: string }[];
  career: string[];
  steps: { title: string; text: string }[];
};

/** Shared "AI & Data Tools" set, grouped by category — identical across all 3 brochures. Image generators (Midjourney, DALL·E, Runway) are out of scope for these programs and excluded. */
export const TOOL_GROUPS: { name: string; tools: string[] }[] = [
  { name: "Data & analysis", tools: ["SQL", "MySQL", "Excel", "pandas", "NumPy", "SciPy", "NLTK", "Seaborn", "Matplotlib"] },
  { name: "BI & visualization", tools: ["Tableau", "Power BI", "Google Analytics", "Streamlit", "Gradio"] },
  { name: "Machine learning", tools: ["scikit-learn", "XGBoost", "TensorFlow", "PyTorch", "Keras", "MLflow"] },
  { name: "Agentic AI", tools: ["LangChain", "LlamaIndex", "Hugging Face", "ChatGPT", "Claude", "Gemini", "n8n"] },
  { name: "Engineering", tools: ["Python", "Git", "GitHub", "Docker", "Airflow", "Terraform"] },
];

/** Shared "What We Offer" career-services list — nearly identical text across all 3 brochures; 2 items parameterized by program name. */
function careerServices(programName: string): string[] {
  return [
    "Dedicated career coach to guide your job search strategy",
    "Resume and LinkedIn profile review tailored to " + programName,
    "Mock interviews with real-time feedback from industry mentors",
    "Access to CareerZeta's hiring partner network",
    "Portfolio and capstone project review before you apply",
    `Guidance on positioning your ${programName} capstone to recruiters`,
    "Interview preparation covering both technical and behavioural rounds",
    "Ongoing alumni community and placement support after you graduate",
  ];
}

/** Shared 4-step "How to Join" process — parameterized by program name. */
function joinSteps(programName: string): { title: string; text: string }[] {
  return [
    {
      title: "Talk to our admissions team",
      text: `Book a call to see if ${programName} is the right fit for where you want to go.`,
    },
    {
      title: "Register & secure your seat",
      text: "Complete your registration — pay the full fee or a registration fee to hold your seat.",
    },
    {
      title: "Get your batch & onboarding details",
      text: "We'll confirm your batch start date and send everything you need before day one.",
    },
    {
      title: "Start learning, mentor-led",
      text: "Join live, mentor-led sessions and start building your portfolio from week one.",
    },
  ];
}

export const PROGRAM_DETAIL_PAGES: ProgramDetailPageData[] = [
  {
    slug: "data-analytics",
    name: "Data Analytics & Agentic AI",
    level: "Beginner",
    duration: "6 months",
    headline: { lead: "Spend less time preparing data. More time ", emphasis: "understanding", trail: " it." },
    intro:
      "Does your current role involve Excel, reports, MIS, operations or business data, but you find yourself spending more time preparing data than actually understanding it?",
    fee: "₹1,05,000",
    feeNote: "Inclusive of all taxes",
    heroPhoto: "/home/pexels-rdne-7580704.png",
    brochureUrl: "/brochures/careerzeta-data-analytics-brochure.pdf",
    syllabusUrl: "/brochures/careerzeta-data-analytics-brochure.pdf",
    stats: [
      { value: "6 Months", label: "Duration" },
      { value: "26", label: "Modules" },
      { value: "10+", label: "Projects" },
      { value: "6", label: "Case Studies" },
      { value: "5 Weeks", label: "Agentic AI" },
    ],
    why: [
      {
        title: "Every industry runs on data",
        text: "Banking, healthcare, retail, telecom, logistics and IT all hire analysts to turn raw data into decisions.",
      },
      {
        title: "Skills that travel",
        text: "SQL, Python, statistics and BI work in every sector, so your options stay open as you grow.",
      },
      {
        title: "Go from database to dashboard",
        text: "Analysts who can work end to end, without waiting on an engineering team, are the ones companies compete for.",
      },
      {
        title: "A career ladder, not just a job",
        text: "Grow from Data Analyst to Senior Analyst, Analytics Engineer, Analytics Lead and Head of Data.",
      },
      {
        title: "AI makes analysts faster",
        text: "Agentic workflows now automate the repetitive parts of analysis. Analysts who can build them move ahead.",
      },
      {
        title: "Proof you can show",
        text: "Graduate with real projects and a portfolio an employer can open, not just a certificate.",
      },
    ],
    ladder: ["Data Analyst", "Senior Data Analyst", "Analytics Engineer", "Analytics Lead", "Head of Data"],
    audience: [
      "Working professionals moving into a data analyst role",
      "Excel-heavy analysts ready to step up to SQL, Python and BI",
      "IT, operations and business professionals who work with data every day",
      "Graduates who want a hands-on start in analytics",
      "Anyone who wants to build AI agents into their analysis work",
    ],
    phases: [
      { name: "Data & Analytics Foundations", modules: ["Introduction to Data Analytics", "Data Literacy, Data Types & Data Quality"] },
      { name: "Excel & Spreadsheet Analytics", modules: ["Excel for Data Analysis", "Power Query & Advanced Excel Automation"] },
      { name: "SQL & Database Analytics", modules: ["SQL Fundamentals", "Advanced SQL & Query Optimization"] },
      { name: "Python for Data Analytics", modules: ["Python Programming Foundations", "Data Wrangling & Exploratory Analysis"] },
      {
        name: "Statistics & Analytical Methods",
        modules: ["Descriptive Statistics & Probability", "Inferential Statistics & Hypothesis Testing"],
      },
      { name: "Data Visualization & BI", modules: ["Power BI & Data Storytelling", "Tableau"] },
      {
        name: "Data Engineering Essentials",
        modules: ["Data Warehousing, ETL & Pipelines", "Cloud Analytics & the Modern Data Stack"],
      },
      {
        name: "Advanced & Applied Analytics",
        modules: [
          "Predictive Analytics & ML Foundations",
          "Time Series & Forecasting",
          "Customer & Marketing Analytics",
          "Financial & Operational Analytics",
          "Capstone & Analytics Portfolio",
        ],
      },
      {
        name: "Agentic AI Immersion",
        modules: [
          "Agentic AI Fundamentals",
          "AI Use-Cases Across the Analytics Workflow",
          "Prompt & Context Engineering",
          "Tools, APIs & MCPs",
          "RAG for Analytics",
          "Agent Memory, Planning & Workflows",
          "Agent Evaluation, Guardrails & Governance",
        ],
      },
    ],
    skills: [
      "SQL & Query Optimization",
      "Excel & Power Query",
      "Python, pandas & NumPy",
      "Exploratory Data Analysis",
      "Statistics & A/B Testing",
      "Power BI & DAX",
      "Tableau",
      "Data Storytelling",
      "Data Warehousing & ETL",
      "Cloud Analytics",
      "Forecasting & Predictive Models",
      "Agentic AI Workflows",
    ],
    toolGroups: TOOL_GROUPS,
    projects: [
      {
        level: "Beginner",
        title: "Complex SQL Sub-Queries",
        text: "Solve layered database problems using SQL subqueries. Work with IN, NOT IN, EXISTS, NOT EXISTS, ANY and ALL to filter, compare and retrieve data efficiently — the query fluency almost every data analyst interview screens for.",
      },
      {
        level: "Beginner",
        title: "Query a Large Relational Database",
        text: "Work with large relational datasets and learn to retrieve meaningful customer information using SQL. Apply tables, data types, functions and operators to perform effective queries at scale.",
      },
      {
        level: "Intermediate",
        title: "Data Cleaning & Preparation with Python",
        text: "Take a messy real-world dataset and make it analysis-ready with Pandas. Handle missing values, duplicates, inconsistent formats and outliers, then document a repeatable cleaning workflow other analysts can rerun.",
      },
      {
        level: "Intermediate",
        title: "Exploratory Data Analysis on Real-World Data",
        text: "Run a full exploratory analysis on an unfamiliar dataset. Profile distributions, test correlations, surface anomalies and build a findings notebook with Matplotlib and Seaborn.",
      },
      {
        level: "Intermediate",
        title: "Customer Segmentation & Personalization",
        text: "Segment customers using demographic, geographic and behavioural data. Build distinct groups, validate them statistically, and translate the segments into targeting and offer recommendations a marketing team can act on.",
      },
      {
        level: "Advanced",
        title: "E-commerce Funnel & Cohort Analysis",
        text: "Analyse user journeys from first visit to repeat purchase. Build cohort retention tables and funnel drop-off analysis in SQL, then quantify where and why customers leave.",
      },
      {
        level: "Advanced",
        title: "Sales Forecasting & Demand Planning",
        text: "Build time series forecasts on historical sales data. Decompose trend and seasonality, compare forecasting approaches, evaluate accuracy, and communicate uncertainty to planning stakeholders.",
      },
      {
        level: "Advanced",
        title: "Risk Management & Fraud Detection",
        text: "Build analytical models to evaluate credit, fraud and operational risk. Identify unusual patterns and suspicious activity using anomaly detection techniques that help organisations spot threats early.",
      },
      {
        level: "Advanced",
        title: "End-to-End ETL Pipeline & Data Warehouse",
        text: "Design a star-schema warehouse and build the pipeline that feeds it. Extract from multiple sources, transform and load on a schedule, then connect a BI layer on top.",
      },
      {
        level: "Advanced",
        title: "Executive KPI Dashboard",
        text: "Create interactive dashboards in Power BI and Tableau to monitor revenue, margin, retention and operational health, presenting insight in a form that shortens management decision cycles.",
      },
    ],
    capstone: [
      "End-to-End Capstone Project",
      "Problem Framing & Data Sourcing",
      "Analysis, Modelling & Validation",
      "Dashboard & Report Delivery",
      "Presenting to Stakeholders",
      "Building an Analytics Portfolio",
      "Interview-Ready Walkthroughs",
    ],
    caseStudies: [
      {
        industry: "Finance",
        title: "Credit Risk Analysis",
        text: "Analyse customer financial data to assess creditworthiness and repayment risk. Build and validate risk models that help lenders make faster decisions and reduce defaults.",
      },
      {
        industry: "Marketing",
        title: "Marketing Campaign Optimization",
        text: "Evaluate campaign data across digital channels to understand what drives engagement and conversion, then reallocate budget to lift return on spend.",
      },
      {
        industry: "Telecom",
        title: "Customer Churn & Retention",
        text: "Analyse usage, billing and service data to identify customers at risk of leaving. Build churn indicators and design retention interventions that hold up with real customers.",
      },
      {
        industry: "Healthcare",
        title: "Patient Flow Optimization",
        text: "Analyse patient arrival, treatment and discharge data to locate workflow bottlenecks, optimising staffing and scheduling to reduce waiting times.",
      },
      {
        industry: "E-commerce",
        title: "Product & User Behaviour Analytics",
        text: "Analyse clickstream and transaction data to understand how users move through a product, diagnosing where journeys break down and what's worth building next.",
      },
      {
        industry: "Pharma",
        title: "Pharma Sales & Demand Forecasting",
        text: "Analyse historical sales, prescription and market data to forecast product demand, supporting inventory planning and distribution.",
      },
    ],
    career: careerServices("Data Analytics & Agentic AI"),
    steps: joinSteps("Data Analytics & Agentic AI"),
  },
  {
    slug: "business-analytics",
    name: "Business Analytics & Agentic AI",
    level: "Intermediate",
    duration: "6 months",
    headline: { lead: "Spend less time pulling reports. More time ", emphasis: "driving", trail: " decisions." },
    intro:
      "Does your current role involve sales, marketing, finance, operations or strategy, but you want to use data more effectively to understand performance and make better business decisions?",
    fee: "₹1,05,000",
    feeNote: "Inclusive of all taxes",
    heroPhoto: "/home/pexels-karola-g-7876668.png",
    brochureUrl: "/brochures/careerzeta-business-analytics-brochure.pdf",
    syllabusUrl: "/brochures/careerzeta-business-analytics-brochure.pdf",
    stats: [
      { value: "6 Months", label: "Duration" },
      { value: "26", label: "Modules" },
      { value: "10+", label: "Projects" },
      { value: "6", label: "Case Studies" },
      { value: "5 Weeks", label: "Agentic AI" },
    ],
    why: [
      {
        title: "Every business runs on data",
        text: "Banking, retail, e-commerce, healthcare, logistics and HR all hire analysts to turn data into decisions.",
      },
      {
        title: "Skills that travel",
        text: "Excel, SQL, statistics and BI work in every industry and role, so your options stay open.",
      },
      {
        title: "Go from data to decisions",
        text: "Analysts who connect business sense with analytical thinking are the ones companies compete for.",
      },
      {
        title: "A career ladder, not just a job",
        text: "Grow from Business Analyst to Senior Analyst, Analytics Manager, Head of BI and VP of Strategy.",
      },
      {
        title: "AI makes analysts faster",
        text: "Agentic workflows now automate the repetitive parts of analysis. Analysts who can build them move ahead.",
      },
      {
        title: "Proof you can show",
        text: "Graduate with real projects and a portfolio an employer can open, not just a certificate.",
      },
    ],
    ladder: [
      "Business Analyst",
      "Senior Business Analyst",
      "Analytics Manager",
      "Head of Business Intelligence",
      "VP of Analytics & Strategy",
    ],
    audience: [
      "Working professionals moving into a business analyst role",
      "Excel users ready to step up to SQL, Power BI and Python",
      "Sales, marketing, finance, operations and HR professionals who work with data every day",
      "Graduates who want a hands-on start in business analytics",
      "Anyone who wants to build AI agents into their daily work",
    ],
    phases: [
      { name: "Business & Data Foundations", modules: ["Introduction to Business Analytics", "Data Literacy & Data Understanding"] },
      { name: "Excel for Business Analytics", modules: ["Excel for Data Analysis", "Advanced Excel & Business Modeling"] },
      { name: "SQL & Database Analytics", modules: ["SQL Fundamentals", "Advanced SQL for Business Analytics"] },
      {
        name: "Statistics for Business Decisions",
        modules: ["Descriptive Statistics", "Inferential Statistics & Hypothesis Testing"],
      },
      {
        name: "Data Visualization & BI",
        modules: ["Data Visualization", "Power BI for Business Intelligence", "Tableau for Business Analytics"],
      },
      { name: "Python for Business Analytics", modules: ["Python for Data Analysis", "Python Visualization & Analytics"] },
      { name: "Advanced Business Analytics", modules: ["Predictive Analytics", "Machine Learning for Business"] },
      {
        name: "Business Applications",
        modules: ["Marketing Analytics", "Sales & Revenue Analytics", "Financial & Operational Analytics", "Customer & HR Analytics"],
      },
      {
        name: "Agentic AI Immersion",
        modules: [
          "Agentic AI Fundamentals",
          "AI Use-Case & Business Process Analysis",
          "Prompt & Context Engineering",
          "Tools, APIs & MCPs",
          "RAG Implementation",
          "Agent Memory, Planning & Workflows",
          "Agent Evaluation, Guardrails & Governance",
        ],
      },
    ],
    skills: [
      "Excel & Business Modeling",
      "SQL & Query Optimization",
      "Python, pandas & Matplotlib",
      "Exploratory Data Analysis",
      "Statistics & Hypothesis Tests",
      "Power BI & DAX",
      "Tableau",
      "Data Storytelling",
      "Predictive Analytics & ML",
      "KPI & Performance Reporting",
      "Marketing & Sales Analytics",
      "Agentic AI Workflows",
    ],
    toolGroups: TOOL_GROUPS,
    projects: [
      {
        level: "Beginner",
        title: "Complex SQL Sub-Queries",
        text: "Solve complex database problems with SQL subqueries. Work with IN, NOT IN, EXISTS, NOT EXISTS, ANY and ALL to filter, compare and retrieve data efficiently from real-world business data.",
      },
      {
        level: "Beginner",
        title: "Query a Large Relational Database",
        text: "Work with large relational datasets and retrieve meaningful customer information using SQL. Apply tables, data types, functions and operators to query effectively.",
      },
      {
        level: "Intermediate",
        title: "Design a Relational Database",
        text: "Learn how relational databases organize connected information for efficient analysis. Analyze global sales and profit data, then build an interactive map that turns business data into clear geographical insights.",
      },
      {
        level: "Intermediate",
        title: "Customer Segmentation & Personalization",
        text: "Segment customers using demographic, geographic and behavioral data. Identify distinct groups and design personalized strategies, offers and recommendations.",
      },
      {
        level: "Advanced",
        title: "Planning Poker",
        text: "Experience collaborative estimation through Planning Poker, an Agile decision-making technique — building estimation, communication, teamwork and analytical thinking.",
      },
      {
        level: "Advanced",
        title: "UK Bank Customer Analytics",
        text: "Analyze UK bank customer data to discover meaningful patterns and insights. Build an interactive dashboard that connects regions to customer details for analytics, visualization and financial interpretation.",
      },
      {
        level: "Advanced",
        title: "Global COVID-19 Mortality Analysis",
        text: "Analyze global COVID-19 data to understand mortality rates and geographical trends. Build an interactive dashboard and world map comparing confirmed cases and deaths across countries.",
      },
      {
        level: "Advanced",
        title: "Risk Management & Fraud Detection",
        text: "Build analytical models to evaluate credit, fraud and operational risks. Identify unusual patterns and suspicious activity with data-driven techniques that help organizations spot threats early.",
      },
      {
        level: "Advanced",
        title: "Supply Chain & Vendor Analytics",
        text: "Analyze supply chain and vendor data to improve inventory management, lead times and supplier performance, identifying cost-saving opportunities that strengthen vendor relationships.",
      },
      {
        level: "Advanced",
        title: "Business Performance Dashboard & KPI Monitoring",
        text: "Create interactive dashboards that monitor revenue, profit margins, customer satisfaction and market share, presenting insights visually to support faster management decisions.",
      },
    ],
    capstone: [
      "End-to-End Capstone Project",
      "Problem Framing & Data Sourcing",
      "Analysis, Modelling & Validation",
      "Dashboard & Report Delivery",
      "Presenting to Stakeholders",
      "Building an Analytics Portfolio",
      "Interview-Ready Walkthroughs",
    ],
    caseStudies: [
      {
        industry: "Finance",
        title: "Credit Risk Analysis",
        text: "Analyze customer financial data to assess creditworthiness and repayment risk. Develop risk models that help lenders make faster decisions and reduce defaults.",
      },
      {
        industry: "Marketing",
        title: "Marketing Campaign Optimization",
        text: "Evaluate campaign data across digital channels to understand what drives engagement and conversions, then optimize budgets to improve ROI.",
      },
      {
        industry: "Sales",
        title: "Sales Performance Analytics",
        text: "Analyze sales across products, regions and teams to find performance trends and growth opportunities, sharpening strategy to drive sustainable growth.",
      },
      {
        industry: "Healthcare",
        title: "Patient Flow Optimization",
        text: "Analyze patient arrival, treatment and discharge data to find workflow bottlenecks, optimizing staffing and scheduling to cut waiting times.",
      },
      {
        industry: "E-commerce & Marketing",
        title: "Customer Segmentation",
        text: "Analyze behavior, purchase history and preferences to build meaningful customer segments, designing personalized campaigns that lift engagement and retention.",
      },
      {
        industry: "Pharma",
        title: "Pharma Sales & Demand Forecasting",
        text: "Analyze historical sales, prescription and market data to forecast product demand, supporting inventory planning, sales strategy and distribution.",
      },
    ],
    career: careerServices("Business Analytics & Agentic AI"),
    steps: joinSteps("Business Analytics & Agentic AI"),
  },
  {
    slug: "data-science",
    name: "PG Program in Data Science & AI",
    level: "Professional",
    duration: "12 months",
    headline: { lead: "Spend less time prototyping models. More time ", emphasis: "shipping", trail: " AI that works." },
    intro:
      "CareerZeta's Data Science & AI Professional Program takes you from data analytics through machine learning and deep learning to generative and agentic AI — so you can build, deploy and govern AI systems end to end.",
    fee: "₹1,65,000",
    feeNote: "Inclusive of all taxes",
    heroPhoto: "/home/pexels-cottonbro-5473956.png",
    brochureUrl: "/brochures/careerzeta-data-science-ai-brochure.pdf",
    syllabusUrl: "/brochures/careerzeta-data-science-ai-brochure.pdf",
    stats: [
      { value: "12 Months", label: "Duration" },
      { value: "38", label: "Modules" },
      { value: "12", label: "Projects" },
      { value: "6", label: "Case Studies" },
      { value: "7", label: "Agentic Modules" },
    ],
    why: [
      {
        title: "Every industry runs on AI",
        text: "Banking, healthcare, retail, telecom and manufacturing all use ML to predict, personalize and automate.",
      },
      {
        title: "Analytics, ML & AI in one path",
        text: "Move from data analytics through machine learning and deep learning to generative and agentic AI.",
      },
      {
        title: "Go from notebook to production",
        text: "Deploy, monitor and improve models in production, the skill that sets hireable data scientists apart.",
      },
      {
        title: "A career ladder, not just a job",
        text: "Grow from Data Scientist to Senior Data Scientist, ML Engineer, AI Engineer and Head of AI.",
      },
      {
        title: "Build with GenAI & agents",
        text: "Go beyond using AI tools to building LLM apps, RAG systems and AI agents that do real work.",
      },
      {
        title: "Proof you can show",
        text: "Graduate with 12 projects and a portfolio an employer can open, not just a certificate.",
      },
    ],
    ladder: ["Data Scientist", "Senior Data Scientist", "ML Engineer", "AI Engineer", "Head of AI"],
    audience: [
      "Working professionals moving into data science, ML or AI roles",
      "Data and business analysts ready to step up to machine learning",
      "Software engineers and developers who want to build AI and LLM applications",
      "Graduates who want a hands-on start in data science and AI",
      "Anyone who wants to build and deploy AI agents end to end",
    ],
    phases: [
      { name: "Data Science & AI Foundations", modules: ["Introduction to Data Science & AI", "Data Literacy, Data Types & Data Quality"] },
      {
        name: "Python for Data Science",
        modules: ["Python Programming Foundations", "Data Wrangling with NumPy & pandas", "Data Visualization with Python"],
      },
      { name: "SQL & Data Engineering", modules: ["SQL for Data Science", "Data Pipelines & Big Data"] },
      {
        name: "Statistics & Mathematics for ML",
        modules: ["Descriptive Statistics & Probability", "Inferential Statistics & Experimentation", "Linear Algebra & Calculus for ML"],
      },
      {
        name: "Analytics & Business Intelligence",
        modules: ["Business Intelligence with Power BI & Tableau", "Applied Analytics & Problem Framing"],
      },
      {
        name: "Machine Learning",
        modules: [
          "Machine Learning Foundations",
          "Feature Engineering & Preprocessing",
          "Regression Models",
          "Classification Models",
          "Ensembles, Model Tuning & Explainable AI",
          "Unsupervised Learning",
          "Time Series Forecasting",
        ],
      },
      {
        name: "Deep Learning",
        modules: ["Neural Networks & Deep Learning", "Computer Vision", "Natural Language Processing", "Transformers & Attention"],
      },
      {
        name: "Generative AI",
        modules: [
          "Generative AI & Large Language Models",
          "Prompt Engineering & Structured Outputs",
          "Retrieval-Augmented Generation (RAG)",
          "Fine-Tuning & LLM Customization",
          "Multimodal & Diffusion Models",
        ],
      },
      { name: "MLOps, Deployment & Capstone", modules: ["MLOps & Model Deployment", "Cloud AI & LLMOps", "Capstone & AI Portfolio"] },
      {
        name: "Agentic AI Immersion",
        modules: [
          "Agentic AI Fundamentals",
          "Agent Use-Cases & System Design",
          "Context Engineering for Agents",
          "Tools, APIs & MCP",
          "Agentic RAG & Knowledge",
          "Memory, Planning & Multi-Agent Workflows",
          "Agent Evaluation, Guardrails & Governance",
        ],
      },
    ],
    skills: [
      "Python & pandas",
      "SQL & Data Pipelines",
      "Statistics & Probability",
      "Machine Learning",
      "Deep Learning",
      "Computer Vision",
      "NLP & Transformers",
      "Generative AI & LLMs",
      "RAG & Vector Databases",
      "Agentic AI Workflows",
      "MLOps & Deployment",
      "Data Storytelling & BI",
    ],
    toolGroups: TOOL_GROUPS,
    projects: [
      {
        level: "Beginner",
        title: "Exploratory Analysis of Retail Sales",
        text: "Clean and explore two years of retail transactions with pandas. Profile the data, fix quality issues and chart sales by region, category and season to surface the questions the business should act on first.",
      },
      {
        level: "Beginner",
        title: "SQL Analytics on an E-commerce Database",
        text: "Query a multi-table e-commerce database to answer real business questions. Use joins, CTEs and window functions to build customer cohorts, repeat-purchase rates and a revenue funnel.",
      },
      {
        level: "Beginner",
        title: "House Price Prediction",
        text: "Build regression models that estimate property prices from location, size and amenities. Compare linear, regularized and tree-based models, and explain which features move the price.",
      },
      {
        level: "Intermediate",
        title: "Credit Default Prediction",
        text: "Predict loan default on imbalanced lending data. Engineer financial features, handle class imbalance, tune classifiers and choose a decision threshold that balances risk against approval rates.",
      },
      {
        level: "Intermediate",
        title: "Customer Churn Prediction with XGBoost",
        text: "Train gradient-boosted models to flag customers likely to leave. Use SHAP to explain each prediction and turn the drivers of churn into targeted retention actions.",
      },
      {
        level: "Intermediate",
        title: "Customer Segmentation with Clustering",
        text: "Segment customers with k-means and hierarchical clustering on behavioral data. Reduce dimensions with PCA and recommend how marketing should treat each group.",
      },
      {
        level: "Intermediate",
        title: "Image Classification with Transfer Learning",
        text: "Classify images with CNNs, then lift accuracy with pretrained models and data augmentation. Compare runs, read confusion matrices and explain where the model still gets it wrong.",
      },
      {
        level: "Intermediate",
        title: "Sentiment Analysis of Customer Reviews",
        text: "Classify reviews by sentiment, moving from TF-IDF baselines to a fine-tuned transformer. Surface the most frequent praise and complaints in a dashboard the business can act on.",
      },
      {
        level: "Advanced",
        title: "Retail Demand Forecasting",
        text: "Forecast weekly demand across stores and products with ARIMA, Prophet and gradient-boosted models. Measure forecast accuracy and show how better forecasts cut stock-outs and overstock.",
      },
      {
        level: "Advanced",
        title: "RAG Assistant for Company Knowledge",
        text: "Build a retrieval-augmented chatbot over policy documents and FAQs. Chunk and embed content into a vector database, add re-ranking and citations, and measure answer accuracy.",
      },
      {
        level: "Advanced",
        title: "Multi-Agent Data Science Crew",
        text: "Design a team of AI agents that plans an analysis, writes and runs Python, builds charts and drafts the report — with a human approving each step before anything ships.",
      },
      {
        level: "Advanced",
        title: "Deploy & Monitor an ML Model",
        text: "Serve a trained model behind a FastAPI endpoint, containerize it with Docker, track versions in MLflow and set up monitoring that alerts you when data drift starts to hurt performance.",
      },
    ],
    capstone: [
      "End-to-End AI Capstone Project",
      "Problem Framing & Data Sourcing",
      "Modeling, Evaluation & Iteration",
      "Deploying an AI Application or Agent",
      "Presenting to Stakeholders",
      "Building a Data Science Portfolio",
      "Interview-Ready Walkthroughs",
    ],
    caseStudies: [
      {
        industry: "Finance",
        title: "Card Fraud Detection",
        text: "Score card transactions for fraud risk. Combine anomaly detection with gradient-boosted classifiers, tune thresholds against the cost of false alarms, and keep the model accurate as fraud patterns shift.",
      },
      {
        industry: "Healthcare",
        title: "Medical Image Triage",
        text: "Train a deep learning model that flags chest X-rays for priority review. Work with limited labeled data through transfer learning, evaluating sensitivity carefully so clinicians stay in charge of every decision.",
      },
      {
        industry: "E-commerce",
        title: "Personalized Recommendations",
        text: "Grow basket size with recommendations tuned to each shopper. Blend collaborative filtering with product embeddings and measure the lift in revenue per visit.",
      },
      {
        industry: "Telecom",
        title: "Network Anomaly Detection",
        text: "Monitor network KPIs across thousands of cell sites and catch anomalies before customers notice, cutting false alerts and routing incidents to the right team.",
      },
      {
        industry: "Manufacturing",
        title: "Predictive Maintenance",
        text: "Use sensor time series to predict machine failures before they happen. Engineer rolling features and plan maintenance windows that cut unplanned downtime.",
      },
      {
        industry: "Insurance",
        title: "GenAI Claims & Support Assistant",
        text: "Build an assistant that answers policyholder questions from policy documents and past tickets. Pair RAG with an agent that checks claim status, adds guardrails and measures resolution rates.",
      },
    ],
    career: careerServices("PG Program in Data Science & AI"),
    steps: joinSteps("PG Program in Data Science & AI"),
  },
];
