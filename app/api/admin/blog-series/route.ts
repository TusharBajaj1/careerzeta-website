import { NextResponse } from "next/server";
import { asc, count } from "drizzle-orm";

import { db } from "@/lib/db";
import { blogPosts, blogSeries } from "@/lib/db/schema";
import { slugify, uniqueSeriesSlug } from "@/lib/blog";

/** Every series, oldest first, with how many posts (draft + published) are filed under each. */
export async function GET() {
  const [series, counts] = await Promise.all([
    db.select().from(blogSeries).orderBy(asc(blogSeries.createdAt)),
    db.select({ seriesId: blogPosts.seriesId, postCount: count() }).from(blogPosts).groupBy(blogPosts.seriesId),
  ]);

  const countBySeriesId = new Map(counts.map((c) => [c.seriesId, c.postCount]));
  const result = series.map((s) => ({ ...s, postCount: countBySeriesId.get(s.id) ?? 0 }));

  return NextResponse.json({ series: result });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { name, description } = body;
  if (typeof name !== "string" || !name.trim() || (description !== undefined && description !== null && typeof description !== "string")) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const slug = await uniqueSeriesSlug(slugify(name));

  const [series] = await db
    .insert(blogSeries)
    .values({
      name: name.trim(),
      slug,
      description: typeof description === "string" && description.trim() ? description.trim() : null,
    })
    .returning();

  return NextResponse.json({ series: { ...series, postCount: 0 } }, { status: 201 });
}
