"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import { STORIES, type ProgramTag } from "@/lib/resourcesContent";

const ALL = "All" as const;
const filters: (ProgramTag | typeof ALL)[] = [
  ALL,
  "Data Analytics & Agentic AI",
  "Business Analytics & Agentic AI",
  "PG Program in Data Science & AI",
  "Generative & Agentic AI",
];

export default function RealWorldStories() {
  const [active, setActive] = useState<ProgramTag | typeof ALL>(ALL);
  const stories =
    active === ALL ? STORIES : STORIES.filter((s) => s.tags.includes(active));

  return (
    <section id="stories" className="scroll-mt-24 bg-slate-100">
      <Reveal className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 lg:px-16 lg:py-20">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Real-world stories
        </h6>
        <h2 className="mt-4 max-w-[28ch] font-display text-4xl leading-tight font-bold text-balance">
          How companies are actually using these skills
        </h2>
        <p className="mt-4 max-w-[64ch] text-lg leading-relaxed opacity-75">
          What was the problem, how was technology used, and what changed as
          a result. Every story links to the original publisher — we
          don&apos;t reproduce their reporting here.
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          {filters.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActive(tag)}
              aria-pressed={active === tag}
              className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-bold transition-transform duration-150 hover:scale-105 ${
                active === tag
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-900"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <StaggerGroup
          key={active}
          className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {stories.map((story) => (
            <StaggerItem key={story.title}>
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col overflow-hidden rounded-2xl bg-white text-gray-900 transition-transform duration-150 hover:-translate-y-2"
              >
                <div className="relative h-[200px] bg-slate-200">
                  {story.image ? (
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
                      className={`object-cover ${
                        story.imagePosition === "top"
                          ? "object-top"
                          : "object-center"
                      }`}
                    />
                  ) : (
                    <MediaPlaceholder
                      icon={ImageIcon}
                      label="Story visual — added periodically"
                      className="h-full w-full"
                    />
                  )}
                  <span className="absolute top-4 left-4 rounded-full bg-gray-900 px-3.5 py-[7px] text-xs font-bold tracking-[0.06em] text-white uppercase">
                    {story.source}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-7">
                  <h3 className="font-display text-xl leading-snug font-bold text-pretty">
                    {story.title}
                  </h3>
                  <p className="flex-1 text-[15px] leading-relaxed opacity-75">
                    {story.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {story.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-sky-100 px-3 py-[5px] text-xs font-bold text-sky-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-sky-700">
                      Read story →
                    </span>
                  </div>
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Reveal>
    </section>
  );
}
