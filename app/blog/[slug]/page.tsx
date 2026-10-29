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
import { blogPosts } from "@/lib/db/schema";
import { buildMetadata } from "@/lib/seo";

async function getPublishedPost(slug: string) {
  const [post] = await db
    .select()
    .from(blogPosts)
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBlogPostingJsonLd(post)) }}
      />

      <Reveal className="mx-auto max-w-[760px] px-6 pt-16 pb-6 md:px-10 lg:px-16 lg:pt-20">
        <Link href="/blog" className="text-sm font-semibold text-sky-700 hover:underline">
          ← Blog
        </Link>

        {post.series ? (
          <span className="mt-6 inline-block w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
            {post.series}
            {post.seriesPart ? ` · Part ${post.seriesPart}` : ""}
          </span>
        ) : null}

        <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">{post.title}</h1>

        <div className="mt-4 text-sm opacity-60">
          {post.author ? `${post.author} · ` : ""}
          {publishedAt.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
          {" · "}
          {readingMinutes} min read
        </div>

        {post.coverImageUrl ? (
          <div className="relative mt-8 h-[320px] w-full overflow-hidden rounded-2xl bg-slate-200 md:h-[420px]">
            <Image src={post.coverImageUrl} alt="" fill className="object-cover" priority />
          </div>
        ) : null}
      </Reveal>

      <article className="mx-auto max-w-[760px] px-6 pt-8 pb-20 md:px-10 lg:px-16">
        <div className="cz-prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>

      <Footer />
    </>
  );
}
