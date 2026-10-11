import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema";
import { rupeesToPaise } from "@/lib/money";
import { PROGRAMS } from "@/lib/content";

const PROGRAM_SLUGS = new Set(PROGRAMS.map((p) => p.slug));

export async function GET() {
  const rows = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  return NextResponse.json({ coupons: rows });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const {
    code,
    discountType,
    discountValue,
    programSlug,
    candidateEmail,
    candidatePhone,
    maxUses,
    expiresAt,
    createdBy,
    notes,
    registrationFeeAmount,
  } = body;

  if (typeof code !== "string" || !code.trim()) {
    return NextResponse.json({ error: "code_required" }, { status: 400 });
  }
  if (discountType !== "percent" && discountType !== "amount") {
    return NextResponse.json({ error: "invalid_discount_type" }, { status: 400 });
  }
  if (typeof discountValue !== "number" || discountValue <= 0) {
    return NextResponse.json({ error: "invalid_discount_value" }, { status: 400 });
  }
  if (discountType === "percent" && discountValue > 100) {
    return NextResponse.json({ error: "percent_over_100" }, { status: 400 });
  }
  if (programSlug && !PROGRAM_SLUGS.has(programSlug)) {
    return NextResponse.json({ error: "invalid_program" }, { status: 400 });
  }
  const hasEmail = typeof candidateEmail === "string" && candidateEmail.trim();
  const hasPhone = typeof candidatePhone === "string" && candidatePhone.trim();
  if (!hasEmail && !hasPhone) {
    return NextResponse.json({ error: "candidate_restriction_required" }, { status: 400 });
  }
  if (typeof createdBy !== "string" || !createdBy.trim()) {
    return NextResponse.json({ error: "created_by_required" }, { status: 400 });
  }
  if (
    registrationFeeAmount !== undefined &&
    registrationFeeAmount !== null &&
    (typeof registrationFeeAmount !== "number" || registrationFeeAmount <= 0)
  ) {
    return NextResponse.json({ error: "invalid_registration_fee_amount" }, { status: 400 });
  }

  try {
    const [created] = await db
      .insert(coupons)
      .values({
        code: code.trim().toUpperCase(),
        discountPercent: discountType === "percent" ? Math.round(discountValue) : null,
        discountAmount: discountType === "amount" ? rupeesToPaise(discountValue) : null,
        programSlug: programSlug || null,
        candidateEmail: hasEmail ? candidateEmail.trim() : null,
        candidatePhone: hasPhone ? candidatePhone.trim() : null,
        maxUses: typeof maxUses === "number" && maxUses > 0 ? Math.round(maxUses) : 1,
        registrationFeeAmount:
          typeof registrationFeeAmount === "number" ? rupeesToPaise(registrationFeeAmount) : null,
        // Stored as end-of-day IST, not UTC midnight — otherwise a coupon set
        // to expire "today" would already look expired by 5:30am IST (UTC+5:30).
        expiresAt: expiresAt ? new Date(`${expiresAt}T23:59:59+05:30`) : null,
        createdBy: createdBy.trim(),
        notes: typeof notes === "string" ? notes.trim() : null,
      })
      .returning();

    return NextResponse.json({ coupon: created }, { status: 201 });
  } catch (err) {
    // Postgres SQLSTATE 23505 = unique_violation. Drizzle wraps the driver's
    // error, so the code lives on `.cause`, not the top-level error.
    const cause = err instanceof Error ? err.cause : undefined;
    const pgCode = cause && typeof cause === "object" && "code" in cause ? cause.code : undefined;
    if (pgCode === "23505") {
      return NextResponse.json({ error: "code_already_exists" }, { status: 409 });
    }
    throw err;
  }
}
