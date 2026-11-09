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
  let invoicesFailed = 0;

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
      const ok = await uploadToDrive("Invoices", `${safeName}.pdf`, pdf);
      if (ok) invoicesUploaded++;
      else invoicesFailed++;
    } catch (err) {
      console.error(`Drive backfill failed for invoice ${row.invoiceNumber}:`, err);
      invoicesFailed++;
    }
  }

  let lettersUploaded = 0;
  let lettersFailed = 0;

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
      const ok = await uploadToDrive("Admission Letters", filename, pdf);
      if (ok) lettersUploaded++;
      else lettersFailed++;
    } catch (err) {
      console.error(`Drive backfill failed for admission letter ${row.admissionNumber}:`, err);
      lettersFailed++;
    }
  }

  return NextResponse.json({
    ok: true,
    invoices: { uploaded: invoicesUploaded, failed: invoicesFailed, total: invoiceRows.length },
    letters: { uploaded: lettersUploaded, failed: lettersFailed, total: letterRows.length },
  });
}
