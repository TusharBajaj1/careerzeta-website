import { NextResponse } from "next/server";
import { isNotNull } from "drizzle-orm";

import { admissionLetterFilename } from "@/lib/admissionNumber";
import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { uploadToDrive } from "@/lib/googleDrive";

/**
 * One-time (or re-runnable) sync of every invoice/admission letter PDF
 * generated before Google Drive sync was wired in, so accounting gets a
 * complete archive rather than only documents generated from now on. Safe
 * to run more than once — uploadToDrive skips a file already present in
 * the target folder by name, so nothing gets duplicated.
 */
export async function POST() {
  let invoicesUploaded = 0;
  const invoiceErrors: string[] = [];

  const invoiceRows = await db
    .select({ invoiceNumber: payments.invoiceNumber, invoicePdfUrl: payments.invoicePdfUrl })
    .from(payments)
    .where(isNotNull(payments.invoicePdfUrl));

  for (const row of invoiceRows) {
    if (!row.invoiceNumber || !row.invoicePdfUrl) continue;
    try {
      const res = await fetch(row.invoicePdfUrl);
      if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
      const pdf = Buffer.from(await res.arrayBuffer());
      const safeName = row.invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, "-");
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
