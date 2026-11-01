import Image from "next/image";
import Link from "next/link";

import Reveal from "@/components/ui/Reveal";

type LatestPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  seriesName: string | null;
  seriesPart: number | null;
  readingMinutes: number;
};

/**
 * Pulls visitors toward whatever was published most recently — the home
 * page is the highest-traffic entry point, and new blog posts/resources
 * otherwise only surface to people who already think to check those
 * sections. Hidden entirely until there's at least one published post.
 */
export default function LatestContent({ post }: { post: LatestPost | null }) {
  if (!post) return null;

  return (
    <section className="relative overflow-hidden bg-[#111827] text-white">
      <div
        aria-hidden
        className="cz-blob absolute -top-[30%] -right-[10%] h-[560px] w-[560px] bg-sky-400 opacity-[0.18]"
      />

      <Reveal className="relative mx-auto grid max-w-[1400px] items-center gap-14 px-6 py-20 md:px-10 lg:grid-cols-2 lg:px-16 lg:py-[110px]">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[28px] bg-[#0b1220]">
          {post.coverImageUrl ? (
            <Image src={post.coverImageUrl} alt="" fill className="object-contain" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-display text-7xl font-bold text-white/10">CZ</span>
            </div>
          )}
        </div>

        <div>
          <span className="cz-pulse-glow inline-flex items-center gap-2 rounded-full bg-sky-400 px-4 py-2 text-xs font-bold tracking-[0.06em] text-[#111827] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#111827]" />
            Just published
          </span>

          {post.seriesName ? (
            <div className="mt-5 text-sm font-bold text-sky-400">
              {post.seriesName}
              {post.seriesPart ? ` · Part ${post.seriesPart}` : ""}
            </div>
          ) : null}

          <h2 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight lg:text-5xl">
            {post.title}
          </h2>

          {post.excerpt ? (
            <p className="mt-4 max-w-[52ch] text-lg text-slate-200">{post.excerpt}</p>
          ) : null}

          <div className="mt-2 text-sm text-slate-400">{post.readingMinutes} min read</div>

          <div className="mt-8 flex flex-wrap items-center gap-7">
            <Link
              href={`/blog/${post.slug}`}
              className="rounded-full bg-sky-400 px-9 py-[18px] text-[17px] font-bold text-[#111827] transition-transform duration-150 hover:scale-105"
            >
              Read it now →
            </Link>
            <Link href="/blog" className="text-[15px] font-bold text-white hover:text-sky-400">
              More from the blog
            </Link>
            <Link href="/resources" className="text-[15px] font-bold text-white hover:text-sky-400">
              Browse Resources
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
