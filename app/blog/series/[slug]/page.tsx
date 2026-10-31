import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";

import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import { db } from "@/lib/db";
import { blogPosts, blogSeries } from "@/lib/db/schema";
import { buildMetadata } from "@/lib/seo";

async function getSeries(slug: string) {
  const [series] = await db.select().from(blogSeries).where(eq(blogSeries.slug, slug)).limit(1);
  return series ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeries(slug);
  if (!series) return buildMetadata({ title: "Series not found — CareerZeta", description: "", path: `/blog/series/${slug}` });

  return buildMetadata({
    title: `${series.name} — CareerZeta Blog`,
    description: series.description ?? series.name,
    path: `/blog/series/${series.slug}`,
  });
}

export const dynamic = "force-dynamic";

export default async function BlogSeriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const series = await getSeries(slug);
  if (!series) notFound();

  const posts = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.seriesId, series.id), eq(blogPosts.status, "published")))
    // Postgres sorts NULLs last in ascending order by default, so posts
    // without a part number fall to the end instead of jumbling the order.
    .orderBy(asc(blogPosts.seriesPart), asc(blogPosts.publishedAt));

  return (
    <>
      <Reveal className="mx-auto max-w-[1100px] px-6 pt-16 pb-6 md:px-10 lg:px-16 lg:pt-20">
        <Link href="/blog/series" className="text-sm font-semibold text-sky-700 hover:underline">
          ← Series
        </Link>
        <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">{series.name}</h1>
        {series.description ? (
          <p className="mt-4 max-w-[60ch] text-base opacity-70">{series.description}</p>
        ) : null}
      </Reveal>

      <div className="mx-auto max-w-[1100px] px-6 pb-20 md:px-10 lg:px-16">
        {posts.length === 0 ? (
          <p className="mt-10 text-sm opacity-60">No posts in this series yet — check back soon.</p>
        ) : (
          <div className="mt-10 flex flex-col gap-5">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex items-stretch gap-5 overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-30px_rgba(17,24,39,.3)] transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="relative hidden w-[180px] shrink-0 bg-[#0b1220] sm:block">
                  {post.coverImageUrl ? (
                    <Image src={post.coverImageUrl} alt="" fill className="object-contain" />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col justify-center p-6">
                  <span className="text-xs font-bold text-sky-700">
                    Part {post.seriesPart ?? index + 1}
                  </span>
                  <h2 className="mt-1 font-display text-lg font-bold">{post.title}</h2>
                  {post.excerpt ? <p className="mt-2 text-sm opacity-70">{post.excerpt}</p> : null}
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
