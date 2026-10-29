import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { sanitizeBlogHtml, slugify, uniqueBlogSlug } from "@/lib/blog";

/** Every post (draft and published) for the admin list, newest first. */
export async function GET() {
  const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  return NextResponse.json({ posts: rows });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { title, slug: requestedSlug, series, seriesPart, excerpt, contentHtml, coverImageUrl, author, status } =
    body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof contentHtml !== "string" ||
    !contentHtml.trim() ||
    (status !== "draft" && status !== "published") ||
    (requestedSlug !== undefined && requestedSlug !== null && typeof requestedSlug !== "string") ||
    (series !== undefined && series !== null && typeof series !== "string") ||
    (seriesPart !== undefined &&
      seriesPart !== null &&
      (typeof seriesPart !== "number" || !Number.isInteger(seriesPart) || seriesPart <= 0)) ||
    (excerpt !== undefined && excerpt !== null && typeof excerpt !== "string") ||
    (coverImageUrl !== undefined && coverImageUrl !== null && typeof coverImageUrl !== "string") ||
    (author !== undefined && author !== null && typeof author !== "string")
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const slug = await uniqueBlogSlug(slugify(typeof requestedSlug === "string" && requestedSlug.trim() ? requestedSlug : title));

  const [post] = await db
    .insert(blogPosts)
    .values({
      title: title.trim(),
      slug,
      series: typeof series === "string" && series.trim() ? series.trim() : null,
      seriesPart: typeof seriesPart === "number" ? seriesPart : null,
      excerpt: typeof excerpt === "string" && excerpt.trim() ? excerpt.trim() : null,
      contentHtml: sanitizeBlogHtml(contentHtml),
      coverImageUrl: typeof coverImageUrl === "string" && coverImageUrl.trim() ? coverImageUrl.trim() : null,
      author: typeof author === "string" && author.trim() ? author.trim() : null,
      status,
      publishedAt: status === "published" ? new Date() : null,
    })
    .returning();

  return NextResponse.json({ post }, { status: 201 });
}
