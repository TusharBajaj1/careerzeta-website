import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments } from "@/lib/db/schema";
import { generateAdmissionLetterPdf } from "@/lib/admissionLetter";
import { defaultAdmissionLetterBody } from "@/lib/admissionLetterTemplate";
import { PROGRAMS } from "@/lib/content";

/**
 * Streams the admission letter PDF back with an attachment header —
 * always freshly regenerated from the enrollment's current data (not the
 * stored "last sent" copy), so downloading after editing the letter text
 * or batch details shows exactly what a Send/Resend would produce, for
 * proofing before it goes out.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const enrollmentId = Number(id);
  if (!Number.isInteger(enrollmentId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);
  if (!enrollment || enrollment.status !== "fully_paid") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;
  const bodyText =
    enrollment.admissionLetterBody?.trim() ||
    defaultAdmissionLetterBody({ candidateName: enrollment.candidateName, programName, totalFeePaise: enrollment.totalFee });

  const pdf = await generateAdmissionLetterPdf({
    enrollmentId: enrollment.id,
    admittedAt: enrollment.admissionLetterSentAt ?? enrollment.createdAt,
    candidateName: enrollment.candidateName,
    candidateEmail: enrollment.candidateEmail,
    candidatePhone: enrollment.candidatePhone,
    programName,
    totalFeePaise: enrollment.totalFee,
    batchDetails: enrollment.batchDetails,
    bodyText,
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Admission-Letter-${enrollment.id}.pdf"`,
    },
  });
}
