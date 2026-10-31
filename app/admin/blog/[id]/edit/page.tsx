import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";

import BlogPostEditor from "@/components/admin/BlogPostEditor";
import { db } from "@/lib/db";
import { blogPosts, blogSeries } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();

  const [[post], seriesOptions] = await Promise.all([
    db.select().from(blogPosts).where(eq(blogPosts.id, postId)).limit(1),
    db.select({ id: blogSeries.id, name: blogSeries.name }).from(blogSeries).orderBy(asc(blogSeries.name)),
  ]);
  if (!post) notFound();

  return (
    <BlogPostEditor
      mode="edit"
      seriesOptions={seriesOptions}
      post={{
        ...post,
        scheduledAt: post.scheduledAt ? post.scheduledAt.toISOString() : null,
        publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      }}
    />
  );
}
