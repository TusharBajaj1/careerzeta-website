import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { accountingSettings } from "@/lib/db/schema";

const SETTINGS_ROW_ID = 1;

/** The single global accounting-close point, or null if nothing's been closed yet. */
export async function getBooksClosedThrough(): Promise<Date | null> {
  const [row] = await db
    .select({ booksClosedThrough: accountingSettings.booksClosedThrough })
    .from(accountingSettings)
    .where(eq(accountingSettings.id, SETTINGS_ROW_ID))
    .limit(1);
  return row?.booksClosedThrough ?? null;
}

/**
 * Moves the close point forward — can only advance it, never roll it back,
 * so a booked invoice can't be casually reopened for editing. Upserts the
 * single settings row since there's nothing to update the first time this
 * is ever called.
 */
export async function closeBooksThrough(date: Date): Promise<{ ok: boolean; error?: string }> {
  const current = await getBooksClosedThrough();
  if (current && date.getTime() <= current.getTime()) {
    return { ok: false, error: "must_be_later_than_current" };
  }

  await db
    .insert(accountingSettings)
    .values({ id: SETTINGS_ROW_ID, booksClosedThrough: date, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: accountingSettings.id,
      set: { booksClosedThrough: date, updatedAt: new Date() },
    });

  return { ok: true };
}

/** An invoice issued on or before the close point is booked — no more regenerating, refreshing, or cancelling it; a correction past this point is a credit-note question for accounting. */
export function isInvoiceLocked(issuedAt: Date, booksClosedThrough: Date | null): boolean {
  return booksClosedThrough !== null && issuedAt.getTime() <= booksClosedThrough.getTime();
}
