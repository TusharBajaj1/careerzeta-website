"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import { STORIES, TAG_ACCENT, tagIcon, type ProgramTag } from "@/lib/resourcesContent";

const ALL = "All" as const;
const filters: (ProgramTag | typeof ALL)[] = [
  ALL,
  "Data Analytics",
  "Business Analytics",
  "Applied AI",
  "Agentic AI",
  "Machine Learning",
  "Data Science",
];

export default function RealWorldStories() {
  const [active, setActive] = useState<ProgramTag | typeof ALL>(ALL);
  const stories =
    active === ALL ? STORIES : STORIES.filter((s) => s.tags.includes(active));

  return (
    <Reveal
      id="stories"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-16 md:px-10 lg:px-16 lg:py-20"
    >
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        Real-world stories
      </h6>
      <h2 className="mt-3.5 max-w-[32ch] font-display text-4xl font-bold">
        How companies are actually using these skills
      </h2>
      <p className="mt-4 max-w-[70ch] text-lg leading-relaxed opacity-75">
        What was the problem, how was technology used, and what changed as a
        result. Every story links to the original publisher — we don&apos;t
        reproduce their reporting here.
      </p>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {filters.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActive(tag)}
            className={`cursor-pointer rounded-2xl px-4 py-2 text-sm font-semibold transition-transform duration-150 hover:scale-105 ${
              active === tag
                ? "bg-gray-900 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <StaggerGroup className="mt-9 grid gap-6 md:grid-cols-2" key={active}>
        {stories.map((story) => {
          const primaryTag = story.tags[0];
          const Icon = tagIcon(primaryTag);
          const color = TAG_ACCENT[primaryTag];
          return (
            <StaggerItem key={story.title}>
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-4 rounded-2xl border-2 border-line bg-white p-7 transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_16px_28px_rgba(17,24,39,0.08)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${color}1a` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} aria-hidden />
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sky-500"
                    aria-hidden
                  />
                </div>

                <h3 className="font-display text-lg font-bold">
                  {story.title}
                </h3>
                <p className="flex-1 text-[15px] leading-relaxed opacity-75">
                  {story.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {story.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold opacity-50">
                    {story.source}
                  </span>
                </div>
              </a>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </Reveal>
  );
}
