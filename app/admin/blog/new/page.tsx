import { asc } from "drizzle-orm";

import BlogPostEditor from "@/components/admin/BlogPostEditor";
import { db } from "@/lib/db";
import { blogSeries } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  const seriesOptions = await db
    .select({ id: blogSeries.id, name: blogSeries.name })
    .from(blogSeries)
    .orderBy(asc(blogSeries.name));

  return <BlogPostEditor mode="create" seriesOptions={seriesOptions} />;
}
