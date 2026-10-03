"use client";

import Image from "next/image";
import { useState } from "react";

import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import { STORIES, type ProgramTag, type Story } from "@/lib/resourcesContent";

const ALL = "All" as const;
const filters: (ProgramTag | typeof ALL)[] = [
  ALL,
  "Data Analytics & Agentic AI",
  "Business Analytics & Agentic AI",
  "PG Program in Data Science & AI",
  "Generative & Agentic AI",
];

const pos = (s: Story) => (s.imagePosition === "top" ? "object-top" : "object-center");

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-sky-100 px-3 py-[5px] text-xs font-bold text-sky-700"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default function RealWorldStories() {
  const [active, setActive] = useState<ProgramTag | typeof ALL>(ALL);
  const list =
    active === ALL ? STORIES : STORIES.filter((s) => s.tags.includes(active));
  const [lead, ...rest] = list;

  return (
    <section id="stories" className="scroll-mt-24 bg-slate-100">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 lg:px-16">
        <Reveal>
          <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
            Real-world stories
          </h6>
          <h2 className="mt-4 max-w-[22ch] font-display text-[clamp(32px,4vw,52px)] leading-[1.1] font-semibold tracking-[-0.03em] text-pretty">
            How companies are actually using these skills
          </h2>
          <p className="mt-4 max-w-[62ch] text-lg text-slate-800">
            What was the problem, how was technology used, and what changed as
            a result. Every story links to the original publisher — we
            don&apos;t reproduce their reporting here.
          </p>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-2.5">
          {filters.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={active === tag}
              onClick={() => setActive(tag)}
              className={`cursor-pointer rounded-full px-[22px] py-[11px] text-sm font-bold transition-transform duration-150 hover:scale-105 ${
                active === tag
                  ? "bg-[#111827] text-white"
                  : "bg-white text-[#111827]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {lead && (
          <a
            key={lead.url}
            href={lead.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 grid overflow-hidden rounded-[32px] bg-white text-[#111827] shadow-[0_30px_70px_-30px_rgba(17,24,39,.4)] transition-transform duration-200 hover:-translate-y-2 md:grid-cols-2"
          >
            <div className="relative min-h-[340px] bg-slate-200">
              <Image
                src={lead.image}
                alt={lead.title}
                fill
                sizes="(min-width:768px) 50vw, 100vw"
                className={`object-cover ${pos(lead)}`}
              />
              <span className="absolute top-5 left-5 rounded-full bg-[#111827] px-4 py-2 text-xs font-bold tracking-[0.06em] text-white uppercase">
                {lead.source}
              </span>
            </div>
            <div className="flex flex-col items-start justify-center gap-4 p-8 lg:p-11">
              <span className="text-xs font-bold tracking-[0.06em] text-sky-700 uppercase">
                Featured story
              </span>
              <h3 className="font-display text-[32px] leading-tight font-semibold tracking-tight text-pretty">
                {lead.title}
              </h3>
              <p className="max-w-[50ch] text-[17px] leading-relaxed text-slate-800">
                {lead.description}
              </p>
              <Tags tags={lead.tags} />
              <span className="mt-1.5 rounded-full bg-[#111827] px-[26px] py-3.5 text-[15px] font-bold text-white">
                Read story →
              </span>
            </div>
          </a>
        )}

        <StaggerGroup
          key={active}
          className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {rest.map((story) => (
            <StaggerItem key={story.url}>
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col overflow-hidden rounded-3xl bg-white text-[#111827] transition-shadow duration-200 hover:shadow-[0_24px_50px_-20px_rgba(17,24,39,.4)]"
              >
                <div className="relative h-[210px] bg-slate-200">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
                    className={`object-cover ${pos(story)}`}
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-[#111827] px-3.5 py-[7px] text-xs font-bold tracking-[0.06em] text-white uppercase">
                    {story.source}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-[26px]">
                  <h3 className="font-display text-xl leading-snug font-semibold tracking-tight text-pretty">
                    {story.title}
                  </h3>
                  <p className="flex-1 text-[15px] leading-relaxed text-slate-800">
                    {story.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
                    <Tags tags={story.tags} />
                    <span className="text-sm font-bold text-sky-700">
                      Read →
                    </span>
                  </div>
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
