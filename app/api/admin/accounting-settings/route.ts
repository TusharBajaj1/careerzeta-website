import { NextResponse } from "next/server";

import { closeBooksThrough, getBooksClosedThrough } from "@/lib/accountingLock";

export async function GET() {
  const booksClosedThrough = await getBooksClosedThrough();
  return NextResponse.json({ booksClosedThrough: booksClosedThrough ? booksClosedThrough.toISOString() : null });
}

/**
 * Closes the books through the given date — every invoice issued on or
 * before it becomes locked (no more regenerate/refresh/cancel). Can only
 * move the close point forward, never back, so this can't be used to
 * accidentally reopen an invoice that's already booked.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const dateStr = body?.date;
  if (typeof dateStr !== "string") {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "invalid_date" }, { status: 400 });
  }

  const result = await closeBooksThrough(date);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, booksClosedThrough: date.toISOString() });
}
