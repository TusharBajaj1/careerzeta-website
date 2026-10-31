import Link from "next/link";
import { asc, count, desc, eq } from "drizzle-orm";

import BlogClient from "@/components/admin/BlogClient";
import BlogSeriesClient from "@/components/admin/BlogSeriesClient";
import { db } from "@/lib/db";
import { blogPosts, blogSeries } from "@/lib/db/schema";

/** Admin pages read live data on every request — never statically prerendered/cached. */
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const [seriesRows, seriesCounts, postRows] = await Promise.all([
    db.select().from(blogSeries).orderBy(asc(blogSeries.createdAt)),
    db.select({ seriesId: blogPosts.seriesId, postCount: count() }).from(blogPosts).groupBy(blogPosts.seriesId),
    db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        seriesId: blogPosts.seriesId,
        seriesName: blogSeries.name,
        seriesPart: blogPosts.seriesPart,
        status: blogPosts.status,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
      })
      .from(blogPosts)
      .leftJoin(blogSeries, eq(blogPosts.seriesId, blogSeries.id))
      .orderBy(desc(blogPosts.createdAt)),
  ]);

  const countBySeriesId = new Map(seriesCounts.map((c) => [c.seriesId, c.postCount]));
  const initialSeries = seriesRows.map((s) => ({ ...s, postCount: countBySeriesId.get(s.id) ?? 0 }));

  const initialPosts = postRows.map((post) => ({
    ...post,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    createdAt: post.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16">
      <Link href="/admin" className="text-sm text-sky-700 hover:underline">
        ← Admin
      </Link>

      <div className="mt-8">
        <BlogSeriesClient initialSeries={initialSeries} />
      </div>

      <div className="mt-14 border-t-2 border-line pt-10">
        <BlogClient initialPosts={initialPosts} />
      </div>
    </div>
  );
}
