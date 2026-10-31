import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";

import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import { estimateReadingMinutes } from "@/lib/blog";
import { buildBlogPostingJsonLd } from "@/lib/blogJsonLd";
import { db } from "@/lib/db";
import { blogPosts, blogSeries } from "@/lib/db/schema";
import { buildMetadata } from "@/lib/seo";

async function getPublishedPost(slug: string) {
  const [post] = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      contentHtml: blogPosts.contentHtml,
      coverImageUrl: blogPosts.coverImageUrl,
      author: blogPosts.author,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
      seriesPart: blogPosts.seriesPart,
      seriesName: blogSeries.name,
      seriesSlug: blogSeries.slug,
    })
    .from(blogPosts)
    .leftJoin(blogSeries, eq(blogPosts.seriesId, blogSeries.id))
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
    .limit(1);
  return post ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return buildMetadata({ title: "Post not found — CareerZeta", description: "", path: `/blog/${slug}` });

  return buildMetadata({
    title: `${post.title} — CareerZeta Blog`,
    description: post.excerpt ?? post.title,
    path: `/blog/${post.slug}`,
    image: post.coverImageUrl ?? undefined,
  });
}

/** Reads live data on every request — see app/blog/page.tsx for why. */
export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const publishedAt = post.publishedAt ?? post.createdAt;
  const readingMinutes = estimateReadingMinutes(post.contentHtml);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBlogPostingJsonLd(post, post.seriesName)),
        }}
      />

      {/* Same outer container (and so the same margins) as the article
          body below — the cz-prose class keeps paragraph line-length
          readable internally instead of narrowing the whole column. */}
      <Reveal className="mx-auto max-w-[1400px] px-6 pt-16 pb-6 md:px-10 lg:px-16 lg:pt-20">
        <Link href="/blog" className="text-sm font-semibold text-sky-700 hover:underline">
          ← Blog
        </Link>

        {post.seriesName && post.seriesSlug ? (
          <Link
            href={`/blog/series/${post.seriesSlug}`}
            className="mt-6 inline-block w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700 transition hover:bg-sky-200"
          >
            {post.seriesName}
            {post.seriesPart ? ` · Part ${post.seriesPart}` : ""}
          </Link>
        ) : null}

        <h1 className="mt-3 max-w-[20ch] font-display text-4xl font-bold md:text-5xl">{post.title}</h1>

        <div className="mt-4 text-sm opacity-60">
          {post.author ? `${post.author} · ` : ""}
          {publishedAt.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
          {" · "}
          {readingMinutes} min read
        </div>

        {post.coverImageUrl ? (
          // object-contain + a fixed banner ratio: whatever shape the admin
          // uploaded, the full image always shows, never zoomed or cropped.
          // A non-wide image just letterboxes against the dark background
          // instead of looking mangled.
          <div className="relative mt-8 aspect-[21/9] w-full overflow-hidden rounded-2xl bg-[#0b1220]">
            <Image src={post.coverImageUrl} alt="" fill className="object-contain" priority />
          </div>
        ) : null}
      </Reveal>

      <article className="mx-auto max-w-[1400px] px-6 pt-8 pb-20 md:px-10 lg:px-16">
        <div className="cz-prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>

      <Footer />
    </>
  );
}
