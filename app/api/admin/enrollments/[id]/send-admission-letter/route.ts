import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments } from "@/lib/db/schema";
import { resendAdmissionLetter, sendAdmissionLetter } from "@/lib/admissionLetterEmail";

/**
 * One button for every "send the candidate their admission letter" case:
 * an enrollment that somehow reached fully_paid without one going out
 * (e.g. the email failed the first time), or a candidate asking for
 * another copy. Resends the existing letter unchanged when one was
 * already sent; generates a fresh one otherwise.
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
  if (enrollment.status !== "fully_paid") {
    return NextResponse.json({ error: "not_fully_paid" }, { status: 400 });
  }

  if (!enrollment.admissionLetterSent) {
    const { sent, pdfUrl } = await sendAdmissionLetter(enrollment);
    await db
      .update(enrollments)
      .set({ admissionLetterSent: sent, admissionLetterSentAt: new Date(), admissionLetterPdfUrl: pdfUrl })
      .where(eq(enrollments.id, enrollmentId));
    return NextResponse.json({ ok: true, sent, fresh: true });
  }

  const { sent, pdfUrl } = await resendAdmissionLetter(enrollment);
  if (pdfUrl) {
    await db.update(enrollments).set({ admissionLetterPdfUrl: pdfUrl }).where(eq(enrollments.id, enrollmentId));
  }
  return NextResponse.json({ ok: true, sent, fresh: false });
}
