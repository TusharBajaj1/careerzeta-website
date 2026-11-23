import { NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { refreshRegistrationLetterDriveCopy } from "@/lib/registrationLetterEmail";

/**
 * Re-renders the registration letter from current data and pushes it to
 * Drive (and blob storage) — no email to the candidate. For pushing a
 * template/content fix into an already-issued letter's Drive copy without
 * re-notifying them. Dates the letter from the registration-fee payment's
 * paidAt (when it would have actually been generated originally), falling
 * back to the enrollment's creation date if that payment can't be found.
 */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const enrollmentId = Number(id);
  if (!Number.isInteger(enrollmentId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);
  if (!enrollment) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const [registrationPayment] = await db
    .select({ paidAt: payments.paidAt })
    .from(payments)
    .where(and(eq(payments.enrollmentId, enrollmentId), eq(payments.type, "registration"), eq(payments.status, "paid")))
    .orderBy(asc(payments.paidAt))
    .limit(1);

  const issuedAt = registrationPayment?.paidAt ?? enrollment.createdAt;

  const result = await refreshRegistrationLetterDriveCopy(enrollment, issuedAt);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "refresh_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, pdfUrl: result.pdfUrl });
}
