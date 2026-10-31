import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { blogPosts, blogSeries } from "@/lib/db/schema";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const seriesId = Number(id);
  if (!Number.isInteger(seriesId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { name, description } = body;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    (description !== undefined && description !== null && typeof description !== "string")
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  // The series slug never changes on edit, for the same reason a post's doesn't — its public URL has to stay stable.
  const [updated] = await db
    .update(blogSeries)
    .set({
      name: name.trim(),
      description: typeof description === "string" && description.trim() ? description.trim() : null,
    })
    .where(eq(blogSeries.id, seriesId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ series: updated });
}

/** Deleting a series un-assigns (rather than deletes) any posts filed under it. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const seriesId = Number(id);
  if (!Number.isInteger(seriesId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  await db.update(blogPosts).set({ seriesId: null }).where(eq(blogPosts.seriesId, seriesId));
  const [deleted] = await db.delete(blogSeries).where(eq(blogSeries.id, seriesId)).returning();

  if (!deleted) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
