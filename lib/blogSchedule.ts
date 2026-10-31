import { and, eq, lte } from "drizzle-orm";

import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";

/**
 * Finds every post whose scheduled time has arrived and flips it to
 * published. publishedAt is set to the scheduled time itself (not when
 * this sweep happens to run) so the post's displayed date matches what
 * was actually intended, even if the cron only fires some hours later.
 */
export async function runScheduledPostsSweep(): Promise<{ published: number }> {
  const due = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.status, "scheduled"), lte(blogPosts.scheduledAt, new Date())));

  for (const post of due) {
    await db
      .update(blogPosts)
      .set({ status: "published", publishedAt: post.scheduledAt, updatedAt: new Date() })
      .where(eq(blogPosts.id, post.id));
  }

  return { published: due.length };
}
