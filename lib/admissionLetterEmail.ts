import { put } from "@vercel/blob";

import { admissionLetterFilename, ensureAdmissionNumber } from "@/lib/admissionNumber";
import { generateAdmissionLetterPdf } from "@/lib/admissionLetter";
import { defaultAdmissionLetterBody } from "@/lib/admissionLetterTemplate";
import { CONTACT, PROGRAMS } from "@/lib/content";
import type { Enrollment } from "@/lib/db/schema";
import { uploadToDrive } from "@/lib/googleDrive";
import { formatPaiseAsInr } from "@/lib/money";
import { sendMail } from "@/lib/mailer";

/** Persists the exact PDF that was emailed, so a later resend/download returns the same document. Never throws. Also mirrors it into Google Drive for accounting, best-effort (no-ops silently if Drive sync isn't configured). */
async function storeAdmissionLetterPdf(enrollmentId: number, driveFilename: string, pdf: Buffer): Promise<string | null> {
  // Run in parallel, not sequentially — but still awaited (not fire-and-forget),
  // since Vercel can tear down the function as soon as it returns, which
  // would silently drop an un-awaited upload.
  const [blobResult] = await Promise.all([
    put(`admission-letters/ADM-${enrollmentId}.pdf`, pdf, { access: "public", contentType: "application/pdf", addRandomSuffix: false }).catch(
      (err) => {
        console.error(`Storing admission letter PDF failed for enrollment ${enrollmentId}:`, err);
        return null;
      },
    ),
    uploadToDrive("Admission Letters", driveFilename, pdf),
  ]);

  return blobResult?.url ?? null;
}

/**
 * Generates the admission letter PDF and emails it to the candidate (cc'd
 * to CONTACT.email for records), for a candidate whose enrollment has just
 * reached fully_paid. Never throws — failures are logged and reflected in
 * the returned `sent` flag rather than blocking the payment-confirmation
 * flow that calls this. The admission number itself is assigned by
 * ensureAdmissionNumber — normally already done by the time this runs
 * (see lib/paymentConfirmation.ts), called again here defensively.
 */
export async function sendAdmissionLetter(
  enrollment: Enrollment,
): Promise<{ sent: boolean; pdfUrl: string | null; admissionNumber: string }> {
  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;
  const bodyText =
    enrollment.admissionLetterBody?.trim() ||
    defaultAdmissionLetterBody({ candidateName: enrollment.candidateName, programName, totalFeePaise: enrollment.totalFee });
  const admissionNumber = await ensureAdmissionNumber(enrollment);

  let pdf: Buffer;
  try {
    pdf = await generateAdmissionLetterPdf({
      admissionNumber,
      admittedAt: new Date(),
      candidateName: enrollment.candidateName,
      candidateEmail: enrollment.candidateEmail,
      candidatePhone: enrollment.candidatePhone,
      programName,
      totalFeePaise: enrollment.totalFee,
      batchDetails: enrollment.batchDetails,
      bodyText,
    });
  } catch (err) {
    console.error(`Admission letter generation failed for enrollment ${enrollment.id}:`, err);
    return { sent: false, pdfUrl: null, admissionNumber };
  }

  const pdfUrl = await storeAdmissionLetterPdf(enrollment.id, admissionLetterFilename(enrollment.candidateName, admissionNumber), pdf);
  const attachments = [
    { filename: admissionLetterFilename(enrollment.candidateName, admissionNumber), content: pdf, contentType: "application/pdf" },
  ];

  const sent = await sendMail({
    to: enrollment.candidateEmail,
    cc: CONTACT.email,
    subject: `Welcome to CareerZeta — Admission Confirmed for ${programName}`,
    text: [
      `Hi ${enrollment.candidateName},`,
      ``,
      `Great news — your fee payment of ${formatPaiseAsInr(enrollment.totalFee)} for ${programName} has been received in full, and your admission is now confirmed.`,
      ``,
      `Your admission letter is attached. Our team will be in touch shortly with your batch and onboarding details.`,
      ``,
      `Questions in the meantime? Reach us at ${CONTACT.email}.`,
      ``,
      `— Team CareerZeta`,
    ].join("\n"),
    attachments,
  });

  return { sent, pdfUrl, admissionNumber };
}

/**
 * Re-sends the admission letter for this enrollment — for when a
 * candidate asks for another copy, or batch details get added/changed
 * after the first send. Unlike invoices, this always regenerates from
 * the enrollment's current data (rather than re-sending the frozen
 * original) since there's no compliance reason to keep an old version
 * once the batch is known, and overwrites the stored PDF so a later
 * download reflects the same update. The admission number itself never
 * changes between sends (see ensureAdmissionNumber).
 */
export async function resendAdmissionLetter(
  enrollment: Enrollment,
): Promise<{ sent: boolean; pdfUrl: string | null; admissionNumber: string | null }> {
  if (!enrollment.admissionLetterSent) return { sent: false, pdfUrl: null, admissionNumber: null };

  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;
  const bodyText =
    enrollment.admissionLetterBody?.trim() ||
    defaultAdmissionLetterBody({ candidateName: enrollment.candidateName, programName, totalFeePaise: enrollment.totalFee });
  const admissionNumber = await ensureAdmissionNumber(enrollment);

  let pdf: Buffer;
  try {
    pdf = await generateAdmissionLetterPdf({
      admissionNumber,
      admittedAt: enrollment.admissionLetterSentAt ?? enrollment.createdAt,
      candidateName: enrollment.candidateName,
      candidateEmail: enrollment.candidateEmail,
      candidatePhone: enrollment.candidatePhone,
      programName,
      totalFeePaise: enrollment.totalFee,
      batchDetails: enrollment.batchDetails,
      bodyText,
    });
  } catch (err) {
    console.error(`Regenerating admission letter PDF failed for enrollment ${enrollment.id}:`, err);
    return { sent: false, pdfUrl: null, admissionNumber };
  }

  const pdfUrl = await storeAdmissionLetterPdf(enrollment.id, admissionLetterFilename(enrollment.candidateName, admissionNumber), pdf);
  const attachments = [
    { filename: admissionLetterFilename(enrollment.candidateName, admissionNumber), content: pdf, contentType: "application/pdf" },
  ];

  const sent = await sendMail({
    to: enrollment.candidateEmail,
    cc: CONTACT.email,
    subject: `Your Admission Letter — ${programName}`,
    text: [
      `Hi ${enrollment.candidateName},`,
      ``,
      `Here's a copy of your admission letter for ${programName}.`,
      ``,
      `Questions? Reach us at ${CONTACT.email}.`,
      ``,
      `— Team CareerZeta`,
    ].join("\n"),
    attachments,
  });

  return { sent, pdfUrl, admissionNumber };
}
