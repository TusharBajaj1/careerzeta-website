import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { coupons, enrollments } from "@/lib/db/schema";

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

/** Only removes a coupon that's never actually been used — anything with real usage history keeps using Revoke instead. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const couponId = Number(id);
  if (!Number.isInteger(couponId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const [coupon] = await db.select().from(coupons).where(eq(coupons.id, couponId)).limit(1);
  if (!coupon) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (coupon.usedCount > 0) {
    return NextResponse.json({ error: "coupon_already_used" }, { status: 400 });
  }

  // Unpaid test enrollments may still reference this coupon — clear the link rather than block the delete.
  await db.update(enrollments).set({ couponId: null }).where(eq(enrollments.couponId, couponId));
  await db.delete(coupons).where(eq(coupons.id, couponId));

  return NextResponse.json({ ok: true });
}
