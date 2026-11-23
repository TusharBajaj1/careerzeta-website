import { put } from "@vercel/blob";

import { CONTACT, PROGRAMS } from "@/lib/content";
import type { Enrollment } from "@/lib/db/schema";
import { uploadToDrive } from "@/lib/googleDrive";
import { formatPaiseAsInr } from "@/lib/money";
import { sendMail } from "@/lib/mailer";
import { generateRegistrationConfirmationPdf } from "@/lib/registrationLetter";

/** "Priya Sharma" -> "Registration Confirmation_Priya Sharma.pdf" — same filesystem-safety treatment as admissionLetterFilename. */
function registrationLetterFilename(candidateName: string): string {
  const safeName = candidateName.replace(/[\\/:*?"<>|]/g, "").trim();
  return `Registration Confirmation_${safeName}.pdf`;
}

/** Persists the exact PDF that was emailed, so a later resend returns the same document. Never throws. Also mirrors it into Google Drive, best-effort. */
async function storeRegistrationLetterPdf(enrollmentId: number, filename: string, pdf: Buffer): Promise<string | null> {
  const [blobResult] = await Promise.all([
    put(`registration-letters/REG-${enrollmentId}.pdf`, pdf, {
      access: "public",
      contentType: "application/pdf",
      addRandomSuffix: false,
    }).catch((err) => {
      console.error(`Storing registration letter PDF failed for enrollment ${enrollmentId}:`, err);
      return null;
    }),
    uploadToDrive("Registration Letters", filename, pdf),
  ]);

  return blobResult?.url ?? null;
}

/**
 * Generates the registration-confirmation PDF and emails it to the
 * candidate (cc'd to CONTACT.email) — for an enrollment that just made its
 * first payment but hasn't paid in full yet. Deliberately a different
 * document from the admission letter: no admission number, no total-fee
 * or balance figures (those vary per learner via coupons/discounts, so
 * this stays generic about them), and says the real Admission Letter
 * follows once the balance is paid. Never throws — failures are logged
 * and reflected in the returned `sent` flag rather than blocking the
 * payment-confirmation flow that calls this.
 */
export async function sendRegistrationConfirmation(
  enrollment: Enrollment,
): Promise<{ sent: boolean; pdfUrl: string | null }> {
  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;

  let pdf: Buffer;
  try {
    pdf = await generateRegistrationConfirmationPdf({
      issuedAt: new Date(),
      candidateName: enrollment.candidateName,
      candidateEmail: enrollment.candidateEmail,
      candidatePhone: enrollment.candidatePhone,
      programName,
      amountPaidPaise: enrollment.amountPaid,
    });
  } catch (err) {
    console.error(`Registration letter generation failed for enrollment ${enrollment.id}:`, err);
    return { sent: false, pdfUrl: null };
  }

  const filename = registrationLetterFilename(enrollment.candidateName);
  const pdfUrl = await storeRegistrationLetterPdf(enrollment.id, filename, pdf);
  const attachments = [{ filename, content: pdf, contentType: "application/pdf" }];

  const sent = await sendMail({
    to: enrollment.candidateEmail,
    cc: CONTACT.email,
    subject: `Registration Confirmed — ${programName}`,
    text: [
      `Hi ${enrollment.candidateName},`,
      ``,
      `We've received your registration fee of ${formatPaiseAsInr(enrollment.amountPaid)} for ${programName} — your seat is now reserved.`,
      ``,
      `Please pay the remaining fee at your earliest convenience. Your official Admission Letter will follow once that's done. A confirmation of this is attached.`,
      ``,
      `Questions in the meantime? Reach us at ${CONTACT.email}.`,
      ``,
      `— Team CareerZeta`,
    ].join("\n"),
    attachments,
  });

  return { sent, pdfUrl };
}

/**
 * Re-renders the registration letter from current data and pushes the
 * result to blob storage + Drive — doesn't email the candidate. For
 * refreshing the Drive copy after a template/wording fix without
 * resending the letter (and re-notifying the candidate) just to update
 * that copy.
 */
export async function refreshRegistrationLetterDriveCopy(
  enrollment: Enrollment,
  issuedAt: Date,
  registrationFeeAmountPaise: number,
): Promise<{ ok: boolean; pdfUrl: string | null; error?: string }> {
  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;

  let pdf: Buffer;
  try {
    pdf = await generateRegistrationConfirmationPdf({
      issuedAt,
      candidateName: enrollment.candidateName,
      candidateEmail: enrollment.candidateEmail,
      candidatePhone: enrollment.candidatePhone,
      programName,
      amountPaidPaise: registrationFeeAmountPaise,
    });
  } catch (err) {
    console.error(`Refreshing registration letter PDF failed for enrollment ${enrollment.id}:`, err);
    return { ok: false, pdfUrl: null };
  }

  // Deliberately not storeRegistrationLetterPdf here — see
  // refreshInvoiceDriveCopy in lib/invoiceEmail.ts for why this action
  // needs Drive's actual success/failure, not just blob storage's.
  const filename = registrationLetterFilename(enrollment.candidateName);
  const [blobResult, driveResult] = await Promise.all([
    put(`registration-letters/REG-${enrollment.id}.pdf`, pdf, {
      access: "public",
      contentType: "application/pdf",
      addRandomSuffix: false,
    }).catch((err) => {
      console.error(`Storing registration letter PDF failed for enrollment ${enrollment.id}:`, err);
      return null;
    }),
    uploadToDrive("Registration Letters", filename, pdf),
  ]);

  if (!driveResult.ok) {
    return { ok: false, pdfUrl: blobResult?.url ?? null, error: driveResult.error ?? "drive_upload_failed" };
  }
  return { ok: true, pdfUrl: blobResult?.url ?? null };
}
