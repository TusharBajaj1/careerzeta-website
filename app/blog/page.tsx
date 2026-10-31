import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import { db } from "@/lib/db";
import { blogPosts, blogSeries } from "@/lib/db/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog — CareerZeta",
  description: "A weekly series on what's changing in data, analytics and AI careers — and how to keep up.",
  path: "/blog",
});

/** Reads live data on every request — matches the rest of the DB-backed pages, and means a new/edited post shows up immediately, not after a stale cache. */
export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const posts = await db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      title: blogPosts.title,
      excerpt: blogPosts.excerpt,
      coverImageUrl: blogPosts.coverImageUrl,
      author: blogPosts.author,
      publishedAt: blogPosts.publishedAt,
      seriesName: blogSeries.name,
      seriesSlug: blogSeries.slug,
      seriesPart: blogPosts.seriesPart,
    })
    .from(blogPosts)
    .leftJoin(blogSeries, eq(blogPosts.seriesId, blogSeries.id))
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt));

  return (
    <>
      <Reveal className="mx-auto max-w-[1400px] px-6 pt-16 pb-6 md:px-10 lg:px-16 lg:pt-20">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">Blog</h6>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">
          From the CareerZeta team
        </h1>
        <p className="mt-4 max-w-[60ch] text-base opacity-70">
          A weekly series on what&apos;s actually changing in data, analytics and AI
          careers — and how to keep up.
        </p>
        <Link
          href="/blog/series"
          className="mt-4 inline-block text-sm font-bold text-sky-700 hover:underline"
        >
          Browse by series →
        </Link>
      </Reveal>

      <div className="mx-auto max-w-[1400px] px-6 pb-20 md:px-10 lg:px-16">
        {posts.length === 0 ? (
          <p className="mt-10 text-sm opacity-60">New posts are on the way — check back soon.</p>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-30px_rgba(17,24,39,.3)] transition-transform duration-200 hover:-translate-y-1"
              >
                {/* object-contain: a thumbnail of whatever shape the cover
                    image is, never a zoomed/cropped slice of it. */}
                <div className="relative h-[180px] bg-[#0b1220]">
                  {post.coverImageUrl ? (
                    <Image src={post.coverImageUrl} alt="" fill className="object-contain" />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {post.seriesName ? (
                    <span className="mb-2 inline-block w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                      {post.seriesName}
                      {post.seriesPart ? ` · Part ${post.seriesPart}` : ""}
                    </span>
                  ) : null}
                  <h2 className="font-display text-lg font-bold">{post.title}</h2>
                  {post.excerpt ? (
                    <p className="mt-2 text-sm opacity-70">{post.excerpt}</p>
                  ) : null}
                  <div className="mt-auto pt-4 text-xs opacity-50">
                    {post.author ? `${post.author} · ` : ""}
                    {post.publishedAt?.toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
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
