import { ArrowUpRight } from "lucide-react";

import Reveal from "@/components/ui/Reveal";

type Tool = {
  name: string;
  tagline: string;
  description: string;
  href: string | null;
};

/**
 * Each tool lives on its own domain/platform rather than being rebuilt
 * under careerzeta.com — this page is a curated directory, not where the
 * tools themselves run. `href: null` means "not live yet" (shown as a
 * disabled "Coming soon" card instead of a link).
 */
const TOOLS: Tool[] = [
  {
    name: "PDFRookie",
    tagline: "PDF tools",
    description:
      "Merge, split, compress and convert PDFs — free, fast, and no sign-up required.",
    href: "https://www.pdfrookie.org/",
  },
  {
    name: "W.O.R.D",
    tagline: "Daily vocabulary",
    description: "One word, explained simply, every day — a running vocabulary builder on Instagram.",
    href: "https://www.instagram.com/w.o.r.dd/",
  },
  {
    name: "Resume Builder",
    tagline: "For students",
    description: "A free resume builder for students — pick a template, fill it in, export a clean PDF.",
    href: null,
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  const isLive = tool.href !== null;

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-bold tracking-[0.06em] text-sky-700 uppercase">{tool.tagline}</div>
        {isLive ? (
          <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:text-sky-700" />
        ) : (
          <span className="shrink-0 rounded-full bg-slate-200 px-3 py-1 text-[11px] font-bold tracking-wide text-slate-600 uppercase">
            Coming soon
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">{tool.name}</h3>
      <p className="mt-2 text-[15px] leading-normal text-slate-700">{tool.description}</p>
      <div className="mt-5 inline-flex rounded-full border border-line px-4 py-1.5 text-xs font-bold tracking-wide text-slate-500 uppercase">
        Supported by CareerZeta
      </div>
    </>
  );

  if (!isLive) {
    return (
      <div className="flex flex-col rounded-[22px] border-2 border-line bg-white p-7 opacity-70">
        {content}
      </div>
    );
  }

  return (
    <a
      href={tool.href!}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col rounded-[22px] border-2 border-line bg-white p-7 transition-transform duration-150 hover:scale-[1.02] hover:border-sky-400"
    >
      {content}
    </a>
  );
}

export default function ToolsGrid() {
  return (
    <section className="bg-slate-100">
      <Reveal className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-16 lg:py-[110px]">
        <h2 className="font-display text-3xl font-semibold tracking-tight lg:text-4xl">
          What&apos;s here so far
        </h2>
        <p className="mt-3 max-w-[60ch] text-lg text-slate-700">
          A growing list — we&apos;ll add more as we build them.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
