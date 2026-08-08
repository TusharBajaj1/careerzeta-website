import { ArrowUpRight } from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { STORIES } from "@/lib/resourcesContent";

export default function RealWorldStories() {
  return (
    <Reveal
      id="stories"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-20 md:px-10 lg:px-16 lg:py-28"
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

      <div className="mt-11 border-t-2 border-line">
        {STORIES.map((story) => (
          <a
            key={story.title}
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 border-b-2 border-line py-7 transition hover:bg-slate-50 md:flex-row md:items-start md:justify-between md:gap-8"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-2xl bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="mt-3 font-display text-xl font-bold">
                {story.title}
              </h3>
              <p className="mt-2 max-w-[65ch] text-[15px] leading-relaxed opacity-75">
                {story.description}
              </p>
              <p className="mt-2 text-sm font-semibold opacity-50">
                {story.source}
              </p>
            </div>

            <span className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-sky-700 whitespace-nowrap">
              Read Story
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </span>
          </a>
        ))}
      </div>
    </Reveal>
  );
}
