import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments } from "@/lib/db/schema";
import { isValidEmail, isValidMobile } from "@/lib/forms";
import { PROGRAMS } from "@/lib/content";

/**
 * The "direct enrollment" flow: no coupon code, no self-serve listed price —
 * every enrollment here was created by an admin with an exact amount
 * already agreed with the candidate. This just looks it up by email+phone
 * (both required, not email alone, so one candidate can't browse another's
 * negotiated price just by guessing an email address).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { email, phone } = body;
  if (typeof email !== "string" || !isValidEmail(email) || typeof phone !== "string" || !isValidMobile(phone)) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const candidates = await db
    .select()
    .from(enrollments)
    .where(
      and(eq(enrollments.candidateEmail, email.trim()), eq(enrollments.status, "pending"), eq(enrollments.amountPaid, 0)),
    )
    .orderBy(desc(enrollments.createdAt));

  const phoneDigits = phone.replace(/\D/g, "");
  const enrollment = candidates.find((c) => c.candidatePhone.replace(/\D/g, "") === phoneDigits);

  if (!enrollment) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const program = PROGRAMS.find((p) => p.slug === enrollment.programSlug);

  return NextResponse.json({
    enrollmentId: enrollment.id,
    programName: program?.name ?? enrollment.programSlug,
    totalFeePaise: enrollment.totalFee,
    registrationFeePaise: enrollment.registrationFeeAmount,
  });
}
