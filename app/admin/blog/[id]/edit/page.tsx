import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import BlogPostEditor from "@/components/admin/BlogPostEditor";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();

  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, postId)).limit(1);
  if (!post) notFound();

  return (
    <BlogPostEditor
      mode="edit"
      post={{
        ...post,
        publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      }}
    />
  );
}
