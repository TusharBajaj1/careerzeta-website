import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { eq, isNotNull } from "drizzle-orm";

import { admissionLetterFilename } from "@/lib/admissionNumber";
import { PROGRAMS } from "@/lib/content";
import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { uploadToDrive } from "@/lib/googleDrive";
import { generateInvoicePdf } from "@/lib/invoice";

/**
 * One-time (or re-runnable) sync of every invoice/admission letter PDF into
 * Drive, so accounting gets a complete archive rather than only documents
 * generated from now on. Safe to run more than once — uploadToDrive skips a
 * file already present in the target folder by name, so nothing duplicates.
 *
 * Invoices predating the invoicePdfUrl column (added partway through this
 * build) have no stored PDF to just upload — those get regenerated here
 * from the payment/enrollment's current data (same fallback
 * resendExistingInvoice already uses) and the result is saved back to
 * payments.invoicePdfUrl, so this is also a one-time backfill of that
 * column, not just of Drive.
 */
export async function POST() {
  let invoicesUploaded = 0;
  const invoiceErrors: string[] = [];

  const invoiceRows = await db
    .select({
      paymentId: payments.id,
      invoiceNumber: payments.invoiceNumber,
      invoicePdfUrl: payments.invoicePdfUrl,
      paymentType: payments.type,
      amount: payments.amount,
      paidAt: payments.paidAt,
      createdAt: payments.createdAt,
      candidateName: enrollments.candidateName,
      candidateEmail: enrollments.candidateEmail,
      candidatePhone: enrollments.candidatePhone,
      candidateState: enrollments.candidateState,
      candidateAddress: enrollments.candidateAddress,
      candidateGstin: enrollments.candidateGstin,
      programSlug: enrollments.programSlug,
      totalFee: enrollments.totalFee,
      amountPaid: enrollments.amountPaid,
    })
    .from(payments)
    .innerJoin(enrollments, eq(payments.enrollmentId, enrollments.id))
    .where(isNotNull(payments.invoiceNumber));

  for (const row of invoiceRows) {
    if (!row.invoiceNumber) continue;
    const safeName = row.invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, "-");
    try {
      let pdf: Buffer;
      if (row.invoicePdfUrl) {
        const res = await fetch(row.invoicePdfUrl);
        if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
        pdf = Buffer.from(await res.arrayBuffer());
      } else {
        const programName = PROGRAMS.find((p) => p.slug === row.programSlug)?.name ?? row.programSlug;
        pdf = await generateInvoicePdf({
          invoiceNumber: row.invoiceNumber,
          issuedAt: row.paidAt ?? row.createdAt,
          candidateName: row.candidateName,
          candidateEmail: row.candidateEmail,
          candidatePhone: row.candidatePhone,
          candidateState: row.candidateState,
          candidateAddress: row.candidateAddress,
          candidateGstin: row.candidateGstin,
          programName,
          paymentType: row.paymentType,
          amountPaidNowPaise: row.amount,
          totalFeePaise: row.totalFee,
          amountPaidTotalPaise: row.amountPaid,
        });

        const blob = await put(`invoices/${safeName}.pdf`, pdf, {
          access: "public",
          contentType: "application/pdf",
          addRandomSuffix: false,
        });
        await db.update(payments).set({ invoicePdfUrl: blob.url }).where(eq(payments.id, row.paymentId));
      }

      const result = await uploadToDrive("Invoices", `${safeName}.pdf`, pdf);
      if (result.ok) invoicesUploaded++;
      else invoiceErrors.push(`${row.invoiceNumber}: ${result.error}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Drive backfill failed for invoice ${row.invoiceNumber}:`, err);
      invoiceErrors.push(`${row.invoiceNumber}: ${message}`);
    }
  }

  let lettersUploaded = 0;
  const letterErrors: string[] = [];

  const letterRows = await db
    .select({
      candidateName: enrollments.candidateName,
      admissionNumber: enrollments.admissionNumber,
      admissionLetterPdfUrl: enrollments.admissionLetterPdfUrl,
    })
    .from(enrollments)
    .where(isNotNull(enrollments.admissionLetterPdfUrl));

  for (const row of letterRows) {
    if (!row.admissionNumber || !row.admissionLetterPdfUrl) continue;
    try {
      const res = await fetch(row.admissionLetterPdfUrl);
      if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
      const pdf = Buffer.from(await res.arrayBuffer());
      const filename = admissionLetterFilename(row.candidateName, row.admissionNumber);
      const result = await uploadToDrive("Admission Letters", filename, pdf);
      if (result.ok) lettersUploaded++;
      else letterErrors.push(`${row.admissionNumber}: ${result.error}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Drive backfill failed for admission letter ${row.admissionNumber}:`, err);
      letterErrors.push(`${row.admissionNumber}: ${message}`);
    }
  }

  return NextResponse.json({
    ok: true,
    invoices: { uploaded: invoicesUploaded, failed: invoiceErrors.length, total: invoiceRows.length, errors: invoiceErrors },
    letters: { uploaded: lettersUploaded, failed: letterErrors.length, total: letterRows.length, errors: letterErrors },
  });
}
