import Link from "next/link";
import { desc } from "drizzle-orm";

import BlogClient from "@/components/admin/BlogClient";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";

/** Admin pages read live data on every request — never statically prerendered/cached. */
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const rows = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      series: blogPosts.series,
      seriesPart: blogPosts.seriesPart,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
    })
    .from(blogPosts)
    .orderBy(desc(blogPosts.createdAt));

  const initialPosts = rows.map((post) => ({
    ...post,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    createdAt: post.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16">
      <Link href="/admin" className="text-sm text-sky-700 hover:underline">
        ← Admin
      </Link>

      <BlogClient initialPosts={initialPosts} />
    </div>
  );
}
