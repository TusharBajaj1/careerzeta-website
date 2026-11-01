import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";

/** Public, lightweight — just enough for the home page's top strip to point at the latest post. */
export async function GET() {
  try {
    const [post] = await db
      .select({ slug: blogPosts.slug, title: blogPosts.title })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(1);

    return NextResponse.json({ post: post ?? null });
  } catch {
    return NextResponse.json({ post: null });
  }
}
