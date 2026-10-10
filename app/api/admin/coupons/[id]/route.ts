import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const couponId = Number(id);
  if (!Number.isInteger(couponId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body || body.status !== "revoked") {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const [updated] = await db
    .update(coupons)
    .set({ status: "revoked" })
    .where(eq(coupons.id, couponId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ coupon: updated });
}
