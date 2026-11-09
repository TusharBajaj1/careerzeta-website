import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { generateInvoicePdf } from "@/lib/invoice";
import { PROGRAMS } from "@/lib/content";

/** Streams the invoice PDF back with an attachment header, so it always downloads as a file rather than opening inline in the browser tab. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paymentId = Number(id);
  if (!Number.isInteger(paymentId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
  if (!payment || !payment.invoiceNumber) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let pdf: Buffer;
  if (payment.invoicePdfUrl) {
    const res = await fetch(payment.invoicePdfUrl);
    if (!res.ok) {
      return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
    }
    pdf = Buffer.from(await res.arrayBuffer());
  } else {
    const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, payment.enrollmentId)).limit(1);
    if (!enrollment) {
      return NextResponse.json({ error: "enrollment_not_found" }, { status: 404 });
    }
    const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;
    pdf = await generateInvoicePdf({
      invoiceNumber: payment.invoiceNumber,
      issuedAt: payment.paidAt ?? payment.createdAt,
      candidateName: enrollment.candidateName,
      candidateEmail: enrollment.candidateEmail,
      candidatePhone: enrollment.candidatePhone,
      candidateState: enrollment.candidateState,
      candidateAddress: enrollment.candidateAddress,
      candidateGstin: enrollment.candidateGstin,
      programName,
      paymentType: payment.type,
      amountPaidNowPaise: payment.amount,
      totalFeePaise: enrollment.totalFee,
      amountPaidTotalPaise: enrollment.amountPaid,
    });
  }

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${payment.invoiceNumber}.pdf"`,
    },
  });
}
