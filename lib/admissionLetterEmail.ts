import { put } from "@vercel/blob";

import { nextAdmissionNumber } from "@/lib/admissionNumber";
import { generateAdmissionLetterPdf } from "@/lib/admissionLetter";
import { defaultAdmissionLetterBody } from "@/lib/admissionLetterTemplate";
import { CONTACT, PROGRAMS } from "@/lib/content";
import type { Enrollment } from "@/lib/db/schema";
import { formatPaiseAsInr } from "@/lib/money";
import { sendMail } from "@/lib/mailer";

/** Persists the exact PDF that was emailed, so a later resend/download returns the same document. Never throws. */
async function storeAdmissionLetterPdf(enrollmentId: number, pdf: Buffer): Promise<string | null> {
  try {
    const blob = await put(`admission-letters/ADM-${enrollmentId}.pdf`, pdf, {
      access: "public",
      contentType: "application/pdf",
      addRandomSuffix: false,
    });
    return blob.url;
  } catch (err) {
    console.error(`Storing admission letter PDF failed for enrollment ${enrollmentId}:`, err);
    return null;
  }
}

/**
 * Generates the admission letter PDF and emails it to the candidate (cc'd
 * to CONTACT.email for records), for a candidate whose enrollment has just
 * reached fully_paid. Never throws — failures are logged and reflected in
 * the returned `sent` flag rather than blocking the payment-confirmation
 * flow that calls this.
 */
export async function sendAdmissionLetter(
  enrollment: Enrollment,
): Promise<{ sent: boolean; pdfUrl: string | null; admissionNumber: string }> {
  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;
  const bodyText =
    enrollment.admissionLetterBody?.trim() ||
    defaultAdmissionLetterBody({ candidateName: enrollment.candidateName, programName, totalFeePaise: enrollment.totalFee });
  // A fresh send only happens once per enrollment (guarded by admissionLetterSent
  // upstream), but reuse any already-assigned number defensively rather than
  // ever risk burning two on the same enrollment.
  const admissionNumber = enrollment.admissionNumber ?? (await nextAdmissionNumber());

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

  const pdfUrl = await storeAdmissionLetterPdf(enrollment.id, pdf);
  const attachments = [{ filename: `Admission-Letter-${enrollment.id}.pdf`, content: pdf, contentType: "application/pdf" }];

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
 * download reflects the same update.
 */
export async function resendAdmissionLetter(
  enrollment: Enrollment,
): Promise<{ sent: boolean; pdfUrl: string | null; admissionNumber: string | null }> {
  if (!enrollment.admissionLetterSent) return { sent: false, pdfUrl: null, admissionNumber: null };

  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;
  const bodyText =
    enrollment.admissionLetterBody?.trim() ||
    defaultAdmissionLetterBody({ candidateName: enrollment.candidateName, programName, totalFeePaise: enrollment.totalFee });
  // Reuses the number assigned at first send so a resend never shows a
  // different reference — except for a letter sent before this feature
  // existed, which gets one assigned now (lazy backfill) rather than
  // staying number-less forever.
  const admissionNumber = enrollment.admissionNumber ?? (await nextAdmissionNumber());

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

  const pdfUrl = await storeAdmissionLetterPdf(enrollment.id, pdf);
  const attachments = [{ filename: `Admission-Letter-${enrollment.id}.pdf`, content: pdf, contentType: "application/pdf" }];

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
