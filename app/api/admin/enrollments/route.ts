import { NextResponse } from "next/server";
import { asc, desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { isValidEmail, isValidMobile } from "@/lib/forms";
import { rupeesToPaise } from "@/lib/money";
import { PROGRAMS } from "@/lib/content";

const PROGRAM_SLUGS = new Set(PROGRAMS.map((p) => p.slug));

/** Enrollments with their payments nested, for the admin view. */
export async function GET() {
  const enrollmentRows = await db.select().from(enrollments).orderBy(desc(enrollments.createdAt));
  const paymentRows = await db.select().from(payments).orderBy(asc(payments.createdAt));

  const result = enrollmentRows.map((enrollment) => ({
    ...enrollment,
    payments: paymentRows.filter((p) => p.enrollmentId === enrollment.id),
  }));

  return NextResponse.json({ enrollments: result });
}

/**
 * Creates an enrollment with no payments yet — for sales-negotiated deals
 * where the candidate didn't come through the public /programs form.
 * A payment (and its Razorpay link) is added separately via
 * /api/admin/enrollments/[id]/payments, since the fee collected upfront is
 * case-by-case (full amount, or a partial registration fee).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { name, email, phone, programSlug, totalFee } = body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !isValidEmail(email) ||
    typeof phone !== "string" ||
    !isValidMobile(phone) ||
    typeof programSlug !== "string" ||
    !PROGRAM_SLUGS.has(programSlug) ||
    typeof totalFee !== "number" ||
    totalFee <= 0
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const [enrollment] = await db
    .insert(enrollments)
    .values({
      candidateName: name.trim(),
      candidateEmail: email.trim(),
      candidatePhone: phone.trim(),
      programSlug,
      totalFee: rupeesToPaise(totalFee),
      status: "pending",
    })
    .returning();

  return NextResponse.json({ enrollment }, { status: 201 });
}
