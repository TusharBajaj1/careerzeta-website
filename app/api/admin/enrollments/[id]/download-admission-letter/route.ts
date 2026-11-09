import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments } from "@/lib/db/schema";
import { generateAdmissionLetterPdf } from "@/lib/admissionLetter";
import { PROGRAMS } from "@/lib/content";

/** Streams the admission letter PDF back with an attachment header. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const enrollmentId = Number(id);
  if (!Number.isInteger(enrollmentId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);
  if (!enrollment || !enrollment.admissionLetterSent) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let pdf: Buffer;
  if (enrollment.admissionLetterPdfUrl) {
    const res = await fetch(enrollment.admissionLetterPdfUrl);
    if (!res.ok) {
      return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
    }
    pdf = Buffer.from(await res.arrayBuffer());
  } else {
    const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;
    pdf = await generateAdmissionLetterPdf({
      enrollmentId: enrollment.id,
      admittedAt: enrollment.admissionLetterSentAt ?? enrollment.createdAt,
      candidateName: enrollment.candidateName,
      candidateEmail: enrollment.candidateEmail,
      candidatePhone: enrollment.candidatePhone,
      programName,
      totalFeePaise: enrollment.totalFee,
    });
  }

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Admission-Letter-${enrollment.id}.pdf"`,
    },
  });
}
