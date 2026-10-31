import type { Metadata } from "next";
import Link from "next/link";
import { and, asc, count, eq } from "drizzle-orm";

import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import { db } from "@/lib/db";
import { blogPosts, blogSeries } from "@/lib/db/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog Series — CareerZeta",
  description: "Browse the CareerZeta blog by series.",
  path: "/blog/series",
});

export const dynamic = "force-dynamic";

export default async function BlogSeriesIndexPage() {
  const rows = await db
    .select({
      id: blogSeries.id,
      name: blogSeries.name,
      slug: blogSeries.slug,
      description: blogSeries.description,
      postCount: count(blogPosts.id),
    })
    .from(blogSeries)
    .innerJoin(blogPosts, and(eq(blogPosts.seriesId, blogSeries.id), eq(blogPosts.status, "published")))
    .groupBy(blogSeries.id)
    .orderBy(asc(blogSeries.name));

  return (
    <>
      <Reveal className="mx-auto max-w-[1100px] px-6 pt-16 pb-6 md:px-10 lg:px-16 lg:pt-20">
        <Link href="/blog" className="text-sm font-semibold text-sky-700 hover:underline">
          ← Blog
        </Link>
        <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Series</h1>
        <p className="mt-4 max-w-[60ch] text-base opacity-70">
          Posts grouped into ongoing series — read them in order, or dip into whichever one interests you.
        </p>
      </Reveal>

      <div className="mx-auto max-w-[1100px] px-6 pb-20 md:px-10 lg:px-16">
        {rows.length === 0 ? (
          <p className="mt-10 text-sm opacity-60">No series published yet — check back soon.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {rows.map((s) => (
              <Link
                key={s.id}
                href={`/blog/series/${s.slug}`}
                className="flex flex-col rounded-3xl border-2 border-line bg-white p-7 transition hover:border-sky-400"
              >
                <h2 className="font-display text-xl font-bold">{s.name}</h2>
                {s.description ? <p className="mt-2 text-sm opacity-70">{s.description}</p> : null}
                <div className="mt-4 text-xs font-bold text-sky-700">
                  {s.postCount} post{s.postCount === 1 ? "" : "s"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
