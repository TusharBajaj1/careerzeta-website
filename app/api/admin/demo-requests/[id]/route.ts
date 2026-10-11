import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { demoRequests } from "@/lib/db/schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const requestId = Number(id);
  if (!Number.isInteger(requestId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.contacted !== "boolean") {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const [updated] = await db
    .update(demoRequests)
    .set({ contacted: body.contacted })
    .where(eq(demoRequests.id, requestId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ demoRequest: updated });
}
