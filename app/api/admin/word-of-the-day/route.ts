import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { wordOfTheDay } from "@/lib/db/schema";

/** Returns the current (latest) word, or null if none has ever been set. */
export async function GET() {
  const [latest] = await db.select().from(wordOfTheDay).orderBy(desc(wordOfTheDay.id)).limit(1);
  return NextResponse.json({ word: latest ?? null });
}

/**
 * Sets today's word for the W.O.R.D card on /tools — inserts a new row
 * rather than editing the last one, so past words stay on record even
 * though only the newest is ever shown publicly.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const word = typeof body?.word === "string" ? body.word.trim() : "";
  const definition = typeof body?.definition === "string" ? body.definition.trim() : "";

  if (!word || !definition) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  if (word.length > 64 || definition.length > 200) {
    return NextResponse.json({ error: "too_long" }, { status: 400 });
  }

  const [created] = await db.insert(wordOfTheDay).values({ word, definition }).returning();
  return NextResponse.json({ ok: true, word: created });
}
