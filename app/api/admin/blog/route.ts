import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { blogPosts, blogSeries } from "@/lib/db/schema";
import { sanitizeBlogHtml, slugify, uniqueBlogSlug } from "@/lib/blog";

/** Every post (draft and published) for the admin list, newest first, with its series name resolved. */
export async function GET() {
  const rows = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      seriesId: blogPosts.seriesId,
      seriesName: blogSeries.name,
      seriesPart: blogPosts.seriesPart,
      status: blogPosts.status,
      scheduledAt: blogPosts.scheduledAt,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
    })
    .from(blogPosts)
    .leftJoin(blogSeries, eq(blogPosts.seriesId, blogSeries.id))
    .orderBy(desc(blogPosts.createdAt));

  return NextResponse.json({ posts: rows });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const {
    title,
    slug: requestedSlug,
    seriesId,
    seriesPart,
    excerpt,
    contentHtml,
    coverImageUrl,
    author,
    status,
    scheduledAt,
  } = body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof contentHtml !== "string" ||
    !contentHtml.trim() ||
    (status !== "draft" && status !== "scheduled" && status !== "published") ||
    (requestedSlug !== undefined && requestedSlug !== null && typeof requestedSlug !== "string") ||
    (seriesId !== undefined && seriesId !== null && (typeof seriesId !== "number" || !Number.isInteger(seriesId))) ||
    (seriesPart !== undefined &&
      seriesPart !== null &&
      (typeof seriesPart !== "number" || !Number.isInteger(seriesPart) || seriesPart <= 0)) ||
    (excerpt !== undefined && excerpt !== null && typeof excerpt !== "string") ||
    (coverImageUrl !== undefined && coverImageUrl !== null && typeof coverImageUrl !== "string") ||
    (author !== undefined && author !== null && typeof author !== "string")
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  let scheduledAtDate: Date | null = null;
  if (status === "scheduled") {
    scheduledAtDate = typeof scheduledAt === "string" ? new Date(scheduledAt) : null;
    if (!scheduledAtDate || Number.isNaN(scheduledAtDate.getTime()) || scheduledAtDate <= new Date()) {
      return NextResponse.json({ error: "invalid_schedule" }, { status: 400 });
    }
  }

  if (typeof seriesId === "number") {
    const [series] = await db.select().from(blogSeries).where(eq(blogSeries.id, seriesId)).limit(1);
    if (!series) {
      return NextResponse.json({ error: "invalid_series" }, { status: 400 });
    }
  }

  const slug = await uniqueBlogSlug(slugify(typeof requestedSlug === "string" && requestedSlug.trim() ? requestedSlug : title));

  const [post] = await db
    .insert(blogPosts)
    .values({
      title: title.trim(),
      slug,
      seriesId: typeof seriesId === "number" ? seriesId : null,
      seriesPart: typeof seriesPart === "number" ? seriesPart : null,
      excerpt: typeof excerpt === "string" && excerpt.trim() ? excerpt.trim() : null,
      contentHtml: sanitizeBlogHtml(contentHtml),
      coverImageUrl: typeof coverImageUrl === "string" && coverImageUrl.trim() ? coverImageUrl.trim() : null,
      author: typeof author === "string" && author.trim() ? author.trim() : null,
      status,
      scheduledAt: scheduledAtDate,
      publishedAt: status === "published" ? new Date() : null,
    })
    .returning();

  return NextResponse.json({ post }, { status: 201 });
}
