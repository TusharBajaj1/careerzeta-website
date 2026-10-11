import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { demoRequests } from "@/lib/db/schema";

export async function GET() {
  const rows = await db.select().from(demoRequests).orderBy(desc(demoRequests.createdAt));
  return NextResponse.json({ demoRequests: rows });
}
