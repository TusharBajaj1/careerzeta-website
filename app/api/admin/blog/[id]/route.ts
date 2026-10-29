import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { sanitizeBlogHtml } from "@/lib/blog";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const [existing] = await db.select().from(blogPosts).where(eq(blogPosts.id, postId)).limit(1);
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const { title, series, seriesPart, excerpt, contentHtml, coverImageUrl, author, status } = body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof contentHtml !== "string" ||
    !contentHtml.trim() ||
    (status !== "draft" && status !== "published") ||
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

  // The slug is never changed on edit, even if the title changes — a
  // published post's URL has to stay stable once shared.
  const [updated] = await db
    .update(blogPosts)
    .set({
      title: title.trim(),
      series: typeof series === "string" && series.trim() ? series.trim() : null,
      seriesPart: typeof seriesPart === "number" ? seriesPart : null,
      excerpt: typeof excerpt === "string" && excerpt.trim() ? excerpt.trim() : null,
      contentHtml: sanitizeBlogHtml(contentHtml),
      coverImageUrl: typeof coverImageUrl === "string" && coverImageUrl.trim() ? coverImageUrl.trim() : null,
      author: typeof author === "string" && author.trim() ? author.trim() : null,
      status,
      // First time this post goes live, lock in publishedAt — unpublishing
      // and republishing later keeps the original date rather than bumping
      // it, so a post's place in the series/feed ordering stays stable.
      publishedAt: status === "published" ? existing.publishedAt ?? new Date() : existing.publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, postId))
    .returning();

  return NextResponse.json({ post: updated });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const [deleted] = await db.delete(blogPosts).where(eq(blogPosts.id, postId)).returning();
  if (!deleted) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
