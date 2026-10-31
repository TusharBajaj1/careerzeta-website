import { timingSafeEqual } from "crypto";

import { NextResponse } from "next/server";

import { runScheduledPostsSweep } from "@/lib/blogSchedule";

/**
 * Triggered by Vercel Cron (see vercel.json). Not under /api/admin, so it
 * isn't covered by the admin session cookie gate in proxy.ts — Vercel Cron
 * can't send that cookie. Instead it's gated on CRON_SECRET, the same way
 * /api/cron/day60-invoices is.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret ?? ""}`;
  const authBuf = Buffer.from(authHeader);
  const expectedBuf = Buffer.from(expected);
  const authorized =
    !!secret && authBuf.length === expectedBuf.length && timingSafeEqual(authBuf, expectedBuf);

  if (!authorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runScheduledPostsSweep();
  return NextResponse.json(result);
}
