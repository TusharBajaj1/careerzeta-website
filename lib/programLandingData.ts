/**
 * Structured content for the dedicated per-program landing pages
 * (/programs/[slug]), sourced from each program's PDF brochure in
 * public/brochures/. Scope deliberately excludes two brochure sections:
 * Top Faculty (real names/photos/employers) and Meet-the-Batch /
 * Top-Destinations (demographic stats, alumni-employer logos) — both
 * skipped per explicit decision, not an oversight.
 *
 * Curriculum is captured at phase -> module-title level, not the full
 * per-module bullet list each brochure also has, to keep this dataset
 * accurate and maintainable.
 */

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export type ProgramLandingData = {
  slug: string;
  /** Short stat chips directly under the hero, e.g. duration/projects/tools count. */
  heroStats: { label: string; value: string }[];
  /** "Why this program" — 6 reasons. */
  whyReasons: string[];
  /** "Program at a Glance" stat grid. */
  glance: { label: string; value: string }[];
  /** "Who it's for" — 5 bullets. */
  whoItsFor: string[];
  /** Full curriculum, phase -> module titles only. */
  curriculum: { phase: string; modules: string[] }[];
  /** "Skills you'll master" — 12 pills. */
  skills: string[];
  /** Course projects with a difficulty badge. */
  projects: { title: string; difficulty: DifficultyLevel; description: string }[];
  /** Capstone & portfolio bullets. */
  capstone: string[];
  /** Industry case studies. */
  caseStudies: { industry: string; title: string; description: string }[];
};

/** Shared "AI & Data Tools" grid — identical 36-tool list across all 3 brochures; rendered as text pills. */
export const SHARED_TOOLS: string[] = [
  "Python",
  "MLflow",
  "LlamaIndex",
  "Hugging Face",
  "LangChain",
  "n8n",
  "TensorFlow",
  "SQL",
  "Tableau",
  "Google Analytics",
  "ChatGPT",
  "Excel",
  "Airflow",
  "Streamlit",
  "Keras",
  "Power BI",
  "Docker",
  "Terraform",
  "MySQL",
  "NumPy",
  "PyTorch",
  "Midjourney",
  "Seaborn",
  "pandas",
  "Matplotlib",
  "Gemini",
  "GitHub",
  "Git",
  "DALL·E",
  "Runway",
  "Gradio",
  "XGBoost",
  "Claude",
  "SciPy",
  "NLTK",
  "scikit-learn",
];

/** Shared "What We Offer" career-services list — nearly identical text across all 3 brochures; 2 items parameterized by program name. */
export function careerServices(programName: string): string[] {
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
export function howToJoin(programName: string): { step: string; title: string; detail: string }[] {
  return [
    {
      step: "01",
      title: "Talk to our admissions team",
      detail: `Book a call to see if ${programName} is the right fit for where you want to go.`,
    },
    {
      step: "02",
      title: "Register & secure your seat",
      detail: "Complete your registration — pay the full fee or a registration fee to hold your seat.",
    },
    {
      step: "03",
      title: "Get your batch & onboarding details",
      detail: "We'll confirm your batch start date and send everything you need before day one.",
    },
    {
      step: "04",
      title: "Start learning, mentor-led",
      detail: "Join live, mentor-led sessions and start building your portfolio from week one.",
    },
  ];
}

export const PROGRAM_LANDING_DATA: ProgramLandingData[] = [
  {
    slug: "data-analytics",
    heroStats: [
      { value: "6 Months", label: "Live + Applied" },
      { value: "26 Modules", label: "One Clear Path" },
      { value: "10+ Projects", label: "Real-World Work" },
      { value: "5 Weeks", label: "Agentic AI" },
    ],
    whyReasons: [
      "Every industry runs on data — banking, healthcare, retail, telecom, logistics and IT all hire analysts to turn raw data into decisions.",
      "Skills that travel — SQL, Python, statistics and BI work in every sector, so your options stay open as you grow.",
      "Go from database to dashboard — analysts who can work end to end, without waiting on an engineering team, are the ones companies compete for.",
      "A career ladder, not just a job — grow from Data Analyst to Senior Analyst, Analytics Engineer, Analytics Lead and Head of Data.",
      "AI makes analysts faster — agentic workflows now automate the repetitive parts of analysis. Analysts who can build them move ahead.",
      "Proof you can show — graduate with real projects and a portfolio an employer can open, not just a certificate.",
    ],
    glance: [
      { label: "Duration", value: "6 Months — Live + applied learning" },
      { label: "Modules", value: "26 — 19 core + 7 Agentic AI" },
      { label: "Phases", value: "8 — Foundations to applied analytics" },
      { label: "Projects", value: "10+ — Real-world, portfolio-ready" },
      { label: "Case Studies", value: "6 — Across six industries" },
      { label: "Agentic AI", value: "5-week immersion" },
    ],
    whoItsFor: [
      "Working professionals moving into a data analyst role",
      "Excel-heavy analysts ready to step up to SQL, Python and BI",
      "IT, operations and business professionals who work with data every day",
      "Graduates who want a hands-on start in analytics",
      "Anyone who wants to build AI agents into their analysis work",
    ],
    curriculum: [
      {
        phase: "Phase 1 — Data & Analytics Foundations",
        modules: ["Introduction to Data Analytics", "Data Literacy, Data Types & Data Quality"],
      },
      {
        phase: "Phase 2 — Excel & Spreadsheet Analytics",
        modules: ["Excel for Data Analysis", "Power Query & Advanced Excel Automation"],
      },
      {
        phase: "Phase 3 — SQL & Database Analytics",
        modules: ["SQL Fundamentals", "Advanced SQL & Query Optimization"],
      },
      {
        phase: "Phase 4 — Python for Data Analytics",
        modules: ["Python Programming Foundations", "Data Wrangling & Exploratory Analysis"],
      },
      {
        phase: "Phase 5 — Statistics & Analytical Methods",
        modules: ["Descriptive Statistics & Probability", "Inferential Statistics & Hypothesis Testing"],
      },
      {
        phase: "Phase 6 — Data Visualization & BI",
        modules: ["Power BI & Data Storytelling", "Tableau"],
      },
      {
        phase: "Phase 7 — Data Engineering Essentials",
        modules: ["Data Warehousing, ETL & Pipelines", "Cloud Analytics & the Modern Data Stack"],
      },
      {
        phase: "Phase 8 — Advanced & Applied Analytics",
        modules: [
          "Predictive Analytics & ML Foundations",
          "Time Series & Forecasting",
          "Customer & Marketing Analytics",
          "Financial & Operational Analytics",
          "Capstone & Analytics Portfolio",
        ],
      },
      {
        phase: "Agentic AI Immersion (5 Weeks)",
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
    projects: [
      {
        title: "Complex SQL Sub-Queries",
        difficulty: "Beginner",
        description:
          "Solve layered database problems using SQL subqueries. Work with IN, NOT IN, EXISTS, NOT EXISTS, ANY and ALL to filter, compare and retrieve data efficiently — the query fluency almost every data analyst interview screens for.",
      },
      {
        title: "Query a Large Relational Database",
        difficulty: "Beginner",
        description:
          "Work with large relational datasets and learn to retrieve meaningful customer information using SQL. Apply tables, data types, functions and operators to perform effective queries at scale.",
      },
      {
        title: "Data Cleaning & Preparation with Python",
        difficulty: "Intermediate",
        description:
          "Take a messy real-world dataset and make it analysis-ready with Pandas. Handle missing values, duplicates, inconsistent formats and outliers, then document a repeatable cleaning workflow other analysts can rerun.",
      },
      {
        title: "Exploratory Data Analysis on Real-World Data",
        difficulty: "Intermediate",
        description:
          "Run a full exploratory analysis on an unfamiliar dataset. Profile distributions, test correlations, surface anomalies and build a findings notebook with Matplotlib and Seaborn.",
      },
      {
        title: "Customer Segmentation & Personalization",
        difficulty: "Intermediate",
        description:
          "Segment customers using demographic, geographic and behavioural data. Build distinct groups, validate them statistically, and translate the segments into targeting and offer recommendations a marketing team can act on.",
      },
      {
        title: "E-commerce Funnel & Cohort Analysis",
        difficulty: "Advanced",
        description:
          "Analyse user journeys from first visit to repeat purchase. Build cohort retention tables and funnel drop-off analysis in SQL, then quantify where and why customers leave.",
      },
      {
        title: "Sales Forecasting & Demand Planning",
        difficulty: "Advanced",
        description:
          "Build time series forecasts on historical sales data. Decompose trend and seasonality, compare forecasting approaches, evaluate accuracy, and communicate uncertainty to planning stakeholders.",
      },
      {
        title: "Risk Management & Fraud Detection",
        difficulty: "Advanced",
        description:
          "Build analytical models to evaluate credit, fraud and operational risk. Identify unusual patterns and suspicious activity using anomaly detection techniques that help organisations spot threats early.",
      },
      {
        title: "End-to-End ETL Pipeline & Data Warehouse",
        difficulty: "Advanced",
        description:
          "Design a star-schema warehouse and build the pipeline that feeds it. Extract from multiple sources, transform and load on a schedule, then connect a BI layer on top.",
      },
      {
        title: "Executive KPI Dashboard",
        difficulty: "Advanced",
        description:
          "Create interactive dashboards in Power BI and Tableau to monitor revenue, margin, retention and operational health, presenting insight in a form that shortens management decision cycles.",
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
        description:
          "Analyse customer financial data to assess creditworthiness and repayment risk. Build and validate risk models that help lenders make faster decisions and reduce defaults.",
      },
      {
        industry: "Marketing",
        title: "Marketing Campaign Optimization",
        description:
          "Evaluate campaign data across digital channels to understand what drives engagement and conversion, then reallocate budget to lift return on spend.",
      },
      {
        industry: "Telecom",
        title: "Customer Churn & Retention",
        description:
          "Analyse usage, billing and service data to identify customers at risk of leaving. Build churn indicators and design retention interventions that hold up with real customers.",
      },
      {
        industry: "Healthcare",
        title: "Patient Flow Optimization",
        description:
          "Analyse patient arrival, treatment and discharge data to locate workflow bottlenecks, optimising staffing and scheduling to reduce waiting times.",
      },
      {
        industry: "E-commerce",
        title: "Product & User Behaviour Analytics",
        description:
          "Analyse clickstream and transaction data to understand how users move through a product, diagnosing where journeys break down and what's worth building next.",
      },
      {
        industry: "Pharma",
        title: "Pharma Sales & Demand Forecasting",
        description:
          "Analyse historical sales, prescription and market data to forecast product demand, supporting inventory planning and distribution.",
      },
    ],
  },
  {
    slug: "business-analytics",
    heroStats: [
      { value: "6 Months", label: "Live + Applied" },
      { value: "26 Modules", label: "One Clear Path" },
      { value: "10+ Projects", label: "Real-World Work" },
      { value: "5 Weeks", label: "Agentic AI" },
    ],
    whyReasons: [
      "Every business runs on data — banking, retail, e-commerce, healthcare, logistics and HR all hire analysts to turn data into decisions.",
      "Skills that travel — Excel, SQL, statistics and BI work in every industry and role, so your options stay open.",
      "Go from data to decisions — analysts who connect business sense with analytical thinking are the ones companies compete for.",
      "A career ladder, not just a job — grow from Business Analyst to Senior Analyst, Analytics Manager, BI, Strategy and Leadership roles.",
      "AI makes analysts faster — agentic workflows now automate the repetitive parts of analysis. Analysts who can build them move ahead.",
      "Proof you can show — graduate with real projects and a portfolio an employer can open, not just a certificate.",
    ],
    glance: [
      { label: "Duration", value: "6 Months — Live + applied learning" },
      { label: "Modules", value: "26 — 19 core + 7 Agentic AI" },
      { label: "Phases", value: "8 — Foundations to business applications" },
      { label: "Projects", value: "10+ — Real-world, portfolio-ready" },
      { label: "Case Studies", value: "6 — Across six industries" },
      { label: "Agentic AI", value: "5-week immersion" },
    ],
    whoItsFor: [
      "Working professionals moving into a business analyst role",
      "Excel users ready to step up to SQL, Power BI and Python",
      "Sales, marketing, finance, operations and HR professionals who work with data every day",
      "Graduates who want a hands-on start in business analytics",
      "Anyone who wants to build AI agents into their daily work",
    ],
    curriculum: [
      {
        phase: "Phase 1 — Business & Data Foundations",
        modules: ["Introduction to Business Analytics", "Data Literacy & Data Understanding"],
      },
      {
        phase: "Phase 2 — Excel for Business Analytics",
        modules: ["Excel for Data Analysis", "Advanced Excel & Business Modeling"],
      },
      {
        phase: "Phase 3 — SQL & Database Analytics",
        modules: ["SQL Fundamentals", "Advanced SQL for Business Analytics"],
      },
      {
        phase: "Phase 4 — Statistics for Business Decisions",
        modules: ["Descriptive Statistics", "Inferential Statistics & Hypothesis Testing"],
      },
      {
        phase: "Phase 5 — Data Visualization & BI",
        modules: ["Data Visualization", "Power BI for Business Intelligence", "Tableau for Business Analytics"],
      },
      {
        phase: "Phase 6 — Python for Business Analytics",
        modules: ["Python for Data Analysis", "Python Visualization & Analytics"],
      },
      {
        phase: "Phase 7 — Advanced Business Analytics",
        modules: ["Predictive Analytics", "Machine Learning for Business"],
      },
      {
        phase: "Phase 8 — Business Applications",
        modules: ["Marketing Analytics", "Sales & Revenue Analytics", "Financial & Operational Analytics", "Customer & HR Analytics"],
      },
      {
        phase: "Agentic AI Immersion (5 Weeks)",
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
    projects: [
      {
        title: "Complex SQL Sub-Queries",
        difficulty: "Beginner",
        description:
          "Solve complex database problems with SQL subqueries. Work with IN, NOT IN, EXISTS, NOT EXISTS, ANY and ALL to filter, compare and retrieve data efficiently from real-world business data.",
      },
      {
        title: "Query a Large Relational Database",
        difficulty: "Beginner",
        description:
          "Work with large relational datasets and retrieve meaningful customer information using SQL. Apply tables, data types, functions and operators to query effectively.",
      },
      {
        title: "Design a Relational Database",
        difficulty: "Intermediate",
        description:
          "Learn how relational databases organize connected information for efficient analysis. Analyze global sales and profit data, then build an interactive map that turns business data into clear geographical insights.",
      },
      {
        title: "Customer Segmentation & Personalization",
        difficulty: "Intermediate",
        description:
          "Segment customers using demographic, geographic and behavioral data. Identify distinct groups and design personalized strategies, offers and recommendations.",
      },
      {
        title: "Planning Poker",
        difficulty: "Advanced",
        description:
          "Experience collaborative estimation through Planning Poker, an Agile decision-making technique — building estimation, communication, teamwork and analytical thinking.",
      },
      {
        title: "UK Bank Customer Analytics",
        difficulty: "Advanced",
        description:
          "Analyze UK bank customer data to discover meaningful patterns and insights. Build an interactive dashboard that connects regions to customer details for analytics, visualization and financial interpretation.",
      },
      {
        title: "Global COVID-19 Mortality Analysis",
        difficulty: "Advanced",
        description:
          "Analyze global COVID-19 data to understand mortality rates and geographical trends. Build an interactive dashboard and world map comparing confirmed cases and deaths across countries.",
      },
      {
        title: "Risk Management & Fraud Detection",
        difficulty: "Advanced",
        description:
          "Build analytical models to evaluate credit, fraud and operational risks. Identify unusual patterns and suspicious activity with data-driven techniques that help organizations spot threats early.",
      },
      {
        title: "Supply Chain & Vendor Analytics",
        difficulty: "Advanced",
        description:
          "Analyze supply chain and vendor data to improve inventory management, lead times and supplier performance, identifying cost-saving opportunities that strengthen vendor relationships.",
      },
      {
        title: "Business Performance Dashboard & KPI Monitoring",
        difficulty: "Advanced",
        description:
          "Create interactive dashboards that monitor revenue, profit margins, customer satisfaction and market share, presenting insights visually to support faster management decisions.",
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
        description:
          "Analyze customer financial data to assess creditworthiness and repayment risk. Develop risk models that help lenders make faster decisions and reduce defaults.",
      },
      {
        industry: "Marketing",
        title: "Marketing Campaign Optimization",
        description:
          "Evaluate campaign data across digital channels to understand what drives engagement and conversions, then optimize budgets to improve ROI.",
      },
      {
        industry: "Sales",
        title: "Sales Performance Analytics",
        description:
          "Analyze sales across products, regions and teams to find performance trends and growth opportunities, sharpening strategy to drive sustainable growth.",
      },
      {
        industry: "Healthcare",
        title: "Patient Flow Optimization",
        description:
          "Analyze patient arrival, treatment and discharge data to find workflow bottlenecks, optimizing staffing and scheduling to cut waiting times.",
      },
      {
        industry: "E-commerce & Marketing",
        title: "Customer Segmentation",
        description:
          "Analyze behavior, purchase history and preferences to build meaningful customer segments, designing personalized campaigns that lift engagement and retention.",
      },
      {
        industry: "Pharma",
        title: "Pharma Sales & Demand Forecasting",
        description:
          "Analyze historical sales, prescription and market data to forecast product demand, supporting inventory planning, sales strategy and distribution.",
      },
    ],
  },
  {
    slug: "data-science",
    heroStats: [
      { value: "12 Months", label: "Live + Applied" },
      { value: "38 Modules", label: "One Clear Path" },
      { value: "12 Projects", label: "Real-World Work" },
      { value: "GenAI", label: "+ Agentic AI" },
    ],
    whyReasons: [
      "Every industry runs on AI — banking, healthcare, retail, telecom and manufacturing all use ML to predict, personalize and automate.",
      "Analytics, ML & AI in one path — move from data analytics through machine learning and deep learning to generative and agentic AI.",
      "Go from notebook to production — deploy, monitor and improve models in production, the skill that sets hireable data scientists apart.",
      "A career ladder, not just a job — grow from Data Scientist or ML Engineer to Senior Data Scientist, AI Engineer and Head of AI.",
      "Build with GenAI & agents — go beyond using AI tools to building LLM apps, RAG systems and AI agents that do real work.",
      "Proof you can show — graduate with 12 projects and a portfolio an employer can open, not just a certificate.",
    ],
    glance: [
      { label: "Duration", value: "12 Months — Live + applied learning" },
      { label: "Modules", value: "38 — 31 core + 7 Agentic AI" },
      { label: "Phases", value: "9 — Analytics to AI deployment" },
      { label: "Projects", value: "12 — Real-world, portfolio-ready" },
      { label: "Case Studies", value: "6 — Across six industries" },
      { label: "Pillars", value: "3 — Analytics, ML & AI" },
    ],
    whoItsFor: [
      "Working professionals moving into data science, ML or AI roles",
      "Data and business analysts ready to step up to machine learning",
      "Software engineers and developers who want to build AI and LLM applications",
      "Graduates who want a hands-on start in data science and AI",
      "Anyone who wants to build and deploy AI agents end to end",
    ],
    curriculum: [
      {
        phase: "Phase 1 — Data Science & AI Foundations",
        modules: ["Introduction to Data Science & AI", "Data Literacy, Data Types & Data Quality"],
      },
      {
        phase: "Phase 2 — Python for Data Science",
        modules: ["Python Programming Foundations", "Data Wrangling with NumPy & pandas", "Data Visualization with Python"],
      },
      {
        phase: "Phase 3 — SQL & Data Engineering",
        modules: ["SQL for Data Science", "Data Pipelines & Big Data"],
      },
      {
        phase: "Phase 4 — Statistics & Mathematics for ML",
        modules: ["Descriptive Statistics & Probability", "Inferential Statistics & Experimentation", "Linear Algebra & Calculus for ML"],
      },
      {
        phase: "Phase 5 — Analytics & Business Intelligence",
        modules: ["Business Intelligence with Power BI & Tableau", "Applied Analytics & Problem Framing"],
      },
      {
        phase: "Phase 6 — Machine Learning",
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
        phase: "Phase 7 — Deep Learning",
        modules: ["Neural Networks & Deep Learning", "Computer Vision", "Natural Language Processing", "Transformers & Attention"],
      },
      {
        phase: "Phase 8 — Generative AI",
        modules: [
          "Generative AI & Large Language Models",
          "Prompt Engineering & Structured Outputs",
          "Retrieval-Augmented Generation (RAG)",
          "Fine-Tuning & LLM Customization",
          "Multimodal & Diffusion Models",
        ],
      },
      {
        phase: "Phase 9 — MLOps, Deployment & Capstone",
        modules: ["MLOps & Model Deployment", "Cloud AI & LLMOps", "Capstone & AI Portfolio"],
      },
      {
        phase: "Agentic AI Immersion",
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
    projects: [
      {
        title: "Exploratory Analysis of Retail Sales",
        difficulty: "Beginner",
        description:
          "Clean and explore two years of retail transactions with pandas. Profile the data, fix quality issues and chart sales by region, category and season to surface the questions the business should act on first.",
      },
      {
        title: "SQL Analytics on an E-commerce Database",
        difficulty: "Beginner",
        description:
          "Query a multi-table e-commerce database to answer real business questions. Use joins, CTEs and window functions to build customer cohorts, repeat-purchase rates and a revenue funnel.",
      },
      {
        title: "House Price Prediction",
        difficulty: "Beginner",
        description:
          "Build regression models that estimate property prices from location, size and amenities. Compare linear, regularized and tree-based models, and explain which features move the price.",
      },
      {
        title: "Credit Default Prediction",
        difficulty: "Intermediate",
        description:
          "Predict loan default on imbalanced lending data. Engineer financial features, handle class imbalance, tune classifiers and choose a decision threshold that balances risk against approval rates.",
      },
      {
        title: "Customer Churn Prediction with XGBoost",
        difficulty: "Intermediate",
        description:
          "Train gradient-boosted models to flag customers likely to leave. Use SHAP to explain each prediction and turn the drivers of churn into targeted retention actions.",
      },
      {
        title: "Customer Segmentation with Clustering",
        difficulty: "Intermediate",
        description:
          "Segment customers with k-means and hierarchical clustering on behavioral data. Reduce dimensions with PCA and recommend how marketing should treat each group.",
      },
      {
        title: "Image Classification with Transfer Learning",
        difficulty: "Intermediate",
        description:
          "Classify images with CNNs, then lift accuracy with pretrained models and data augmentation. Compare runs, read confusion matrices and explain where the model still gets it wrong.",
      },
      {
        title: "Sentiment Analysis of Customer Reviews",
        difficulty: "Intermediate",
        description:
          "Classify reviews by sentiment, moving from TF-IDF baselines to a fine-tuned transformer. Surface the most frequent praise and complaints in a dashboard the business can act on.",
      },
      {
        title: "Retail Demand Forecasting",
        difficulty: "Advanced",
        description:
          "Forecast weekly demand across stores and products with ARIMA, Prophet and gradient-boosted models. Measure forecast accuracy and show how better forecasts cut stock-outs and overstock.",
      },
      {
        title: "RAG Assistant for Company Knowledge",
        difficulty: "Advanced",
        description:
          "Build a retrieval-augmented chatbot over policy documents and FAQs. Chunk and embed content into a vector database, add re-ranking and citations, and measure answer accuracy.",
      },
      {
        title: "Multi-Agent Data Science Crew",
        difficulty: "Advanced",
        description:
          "Design a team of AI agents that plans an analysis, writes and runs Python, builds charts and drafts the report — with a human approving each step before anything ships.",
      },
      {
        title: "Deploy & Monitor an ML Model",
        difficulty: "Advanced",
        description:
          "Serve a trained model behind a FastAPI endpoint, containerize it with Docker, track versions in MLflow and set up monitoring that alerts you when data drift starts to hurt performance.",
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
        description:
          "Score card transactions for fraud risk. Combine anomaly detection with gradient-boosted classifiers, tune thresholds against the cost of false alarms, and keep the model accurate as fraud patterns shift.",
      },
      {
        industry: "Healthcare",
        title: "Medical Image Triage",
        description:
          "Train a deep learning model that flags chest X-rays for priority review. Work with limited labeled data through transfer learning, evaluating sensitivity carefully so clinicians stay in charge of every decision.",
      },
      {
        industry: "E-commerce",
        title: "Personalized Recommendations",
        description:
          "Grow basket size with recommendations tuned to each shopper. Blend collaborative filtering with product embeddings and measure the lift in revenue per visit.",
      },
      {
        industry: "Telecom",
        title: "Network Anomaly Detection",
        description:
          "Monitor network KPIs across thousands of cell sites and catch anomalies before customers notice, cutting false alerts and routing incidents to the right team.",
      },
      {
        industry: "Manufacturing",
        title: "Predictive Maintenance",
        description:
          "Use sensor time series to predict machine failures before they happen. Engineer rolling features and plan maintenance windows that cut unplanned downtime.",
      },
      {
        industry: "Insurance",
        title: "GenAI Claims & Support Assistant",
        description:
          "Build an assistant that answers policyholder questions from policy documents and past tickets. Pair RAG with an agent that checks claim status, adds guardrails and measures resolution rates.",
      },
    ],
  },
];
