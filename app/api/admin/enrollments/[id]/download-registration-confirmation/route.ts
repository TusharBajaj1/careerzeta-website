import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments } from "@/lib/db/schema";
import { PROGRAMS } from "@/lib/content";
import { generateRegistrationConfirmationPdf } from "@/lib/registrationLetter";

/**
 * Streams the registration-confirmation PDF back with an attachment
 * header — always freshly regenerated from the enrollment's current data,
 * so the admin can preview exactly what a Send would produce before
 * actually sending it. Mirrors download-admission-letter's pattern.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const enrollmentId = Number(id);
  if (!Number.isInteger(enrollmentId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);
  if (!enrollment || enrollment.status !== "registration_paid") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;

  const pdf = await generateRegistrationConfirmationPdf({
    issuedAt: new Date(),
    candidateName: enrollment.candidateName,
    candidateEmail: enrollment.candidateEmail,
    candidatePhone: enrollment.candidatePhone,
    programName,
    amountPaidPaise: enrollment.amountPaid,
  });

  const safeName = enrollment.candidateName.replace(/[\\/:*?"<>|]/g, "").trim();

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Registration Confirmation_${safeName}.pdf"`,
    },
  });
}
