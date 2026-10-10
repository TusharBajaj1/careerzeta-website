import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { coupons, type Coupon } from "@/lib/db/schema";

export type CouponValidationResult =
  | { valid: true; coupon: Coupon; discountPaise: number }
  | { valid: false; reason: string };

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Checks a coupon code against the candidate who's trying to use it and the
 * program/price they're enrolling in. Does NOT mark the coupon as used —
 * that only happens once a payment actually succeeds (see the webhook handler).
 */
export async function validateCoupon({
  code,
  candidateEmail,
  candidatePhone,
  programSlug,
  originalFeePaise,
}: {
  code: string;
  candidateEmail: string;
  candidatePhone: string;
  programSlug: string;
  originalFeePaise: number;
}): Promise<CouponValidationResult> {
  const [coupon] = await db
    .select()
    .from(coupons)
    .where(eq(coupons.code, code.trim().toUpperCase()))
    .limit(1);

  if (!coupon) {
    return { valid: false, reason: "That coupon code doesn't exist." };
  }

  if (coupon.status !== "active") {
    return { valid: false, reason: "That coupon is no longer active." };
  }

  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    return { valid: false, reason: "That coupon has expired." };
  }

  if (coupon.usedCount >= coupon.maxUses) {
    return { valid: false, reason: "That coupon has already been used." };
  }

  if (coupon.programSlug && coupon.programSlug !== programSlug) {
    return { valid: false, reason: "That coupon doesn't apply to this program." };
  }

  const emailMatches =
    !coupon.candidateEmail ||
    coupon.candidateEmail.trim().toLowerCase() === candidateEmail.trim().toLowerCase();
  const phoneMatches =
    !coupon.candidatePhone || normalizePhone(coupon.candidatePhone) === normalizePhone(candidatePhone);

  // At least one restriction must be set on every coupon (enforced at creation time)
  // and the candidate must match whichever ones are set.
  if (!emailMatches || !phoneMatches) {
    return { valid: false, reason: "That coupon isn't valid for this email/phone." };
  }

  const discountPaise = coupon.discountPercent
    ? Math.round((originalFeePaise * coupon.discountPercent) / 100)
    : Math.min(coupon.discountAmount ?? 0, originalFeePaise);

  return { valid: true, coupon, discountPaise };
}
