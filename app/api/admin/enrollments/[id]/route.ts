import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments } from "@/lib/db/schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const enrollmentId = Number(id);
  if (!Number.isInteger(enrollmentId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body || body.status !== "cancelled") {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const [updated] = await db
    .update(enrollments)
    .set({ status: "cancelled" })
    .where(eq(enrollments.id, enrollmentId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ enrollment: updated });
}
