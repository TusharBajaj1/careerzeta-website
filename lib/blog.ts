import { eq } from "drizzle-orm";
import sanitizeHtml from "sanitize-html";

import { db } from "@/lib/db";
import { blogPosts, blogSeries } from "@/lib/db/schema";

/** Converts a post title into a URL-safe slug — lowercase, hyphenated, ASCII only. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** base-slug, base-slug-2, base-slug-3, ... — the first one not already taken (excluding excludeId, for edits). */
export async function uniqueBlogSlug(base: string, excludeId?: number): Promise<string> {
  const safeBase = base || "post";
  let candidate = safeBase;
  let suffix = 2;
  for (;;) {
    const [existing] = await db.select().from(blogPosts).where(eq(blogPosts.slug, candidate)).limit(1);
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${safeBase}-${suffix}`;
    suffix += 1;
  }
}

/** Same idea as uniqueBlogSlug, for the blog_series table. */
export async function uniqueSeriesSlug(base: string, excludeId?: number): Promise<string> {
  const safeBase = base || "series";
  let candidate = safeBase;
  let suffix = 2;
  for (;;) {
    const [existing] = await db.select().from(blogSeries).where(eq(blogSeries.slug, candidate)).limit(1);
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${safeBase}-${suffix}`;
    suffix += 1;
  }
}

/** ~200 wpm reading speed, based on the plain-text word count of the rendered HTML. */
export function estimateReadingMinutes(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Sanitizes the rich-text editor's HTML before it's stored. The editor's
 * own schema already constrains what a paste can produce, but this is
 * defense in depth against any content that reaches the database some
 * other way (e.g. a direct API call).
 */
export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "s",
      "u",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "code",
      "pre",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
