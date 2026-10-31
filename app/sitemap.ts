import type { MetadataRoute } from "next";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { blogPosts, blogSeries } from "@/lib/db/schema";

const BASE_URL = "https://www.careerzeta.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/programs",
    "/resources",
    "/blog",
    "/blog/series",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-of-use",
    "/refund-and-cancellation-policy",
  ];

  const staticEntries = routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));

  // The sitemap is generated at build time, when CareerZeta_DATABASE_URL
  // may not be configured (e.g. a preview build) — fall back to just the
  // static routes rather than failing the build.
  try {
    const posts = await db
      .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));

    const postEntries = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
    }));

    // Only series with at least one published post get a public page.
    const seriesRows = await db
      .selectDistinct({ slug: blogSeries.slug })
      .from(blogSeries)
      .innerJoin(blogPosts, and(eq(blogPosts.seriesId, blogSeries.id), eq(blogPosts.status, "published")));

    const seriesEntries = seriesRows.map((s) => ({
      url: `${BASE_URL}/blog/series/${s.slug}`,
      lastModified: new Date(),
    }));

    return [...staticEntries, ...postEntries, ...seriesEntries];
  } catch {
    return staticEntries;
  }
}
