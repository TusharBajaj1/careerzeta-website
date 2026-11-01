import { desc, eq } from "drizzle-orm";

import ClosingCta from "@/components/home/ClosingCta";
import Hero from "@/components/home/Hero";
import LatestContent from "@/components/home/LatestContent";
import OurStory from "@/components/home/OurStory";
import ProgramExplorer from "@/components/home/ProgramExplorer";
import Strengths from "@/components/home/Strengths";
import Ticker from "@/components/home/Ticker";
import Footer from "@/components/layout/Footer";
import { estimateReadingMinutes } from "@/lib/blog";
import { db } from "@/lib/db";
import { blogPosts, blogSeries } from "@/lib/db/schema";

/** The most recently published post, for the home page's "Just published" teaser — null (section hides) if none, or if the DB isn't reachable at build time. */
async function getLatestPost() {
  try {
    const [post] = await db
      .select({
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        coverImageUrl: blogPosts.coverImageUrl,
        contentHtml: blogPosts.contentHtml,
        seriesName: blogSeries.name,
        seriesPart: blogPosts.seriesPart,
      })
      .from(blogPosts)
      .leftJoin(blogSeries, eq(blogPosts.seriesId, blogSeries.id))
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(1);

    if (!post) return null;
    return { ...post, readingMinutes: estimateReadingMinutes(post.contentHtml) };
  } catch {
    return null;
  }
}

/** Home is otherwise fully static — this lets the "Just published" teaser catch up with a new post without needing a full redeploy. */
export const revalidate = 1800;

export default async function Home() {
  const latestPost = await getLatestPost();

  return (
    <>
      <Hero />
      <Ticker />
      <OurStory />
      <ProgramExplorer />
      <Strengths />
      <LatestContent post={latestPost} />
      <ClosingCta />
      <Footer />
    </>
  );
}
