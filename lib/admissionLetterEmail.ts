import { put } from "@vercel/blob";

import { generateAdmissionLetterPdf } from "@/lib/admissionLetter";
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
): Promise<{ sent: boolean; pdfUrl: string | null }> {
  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;

  let pdf: Buffer;
  try {
    pdf = await generateAdmissionLetterPdf({
      enrollmentId: enrollment.id,
      admittedAt: new Date(),
      candidateName: enrollment.candidateName,
      candidateEmail: enrollment.candidateEmail,
      candidatePhone: enrollment.candidatePhone,
      programName,
      totalFeePaise: enrollment.totalFee,
    });
  } catch (err) {
    console.error(`Admission letter generation failed for enrollment ${enrollment.id}:`, err);
    return { sent: false, pdfUrl: null };
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

  return { sent, pdfUrl };
}

/**
 * Re-sends the exact admission letter already on file for this enrollment
 * — for when a candidate asks for another copy. Prefers the stored PDF;
 * falls back to regenerating for a letter issued before PDFs were
 * persisted.
 */
export async function resendAdmissionLetter(enrollment: Enrollment): Promise<boolean> {
  if (!enrollment.admissionLetterSent) return false;

  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;

  let pdf: Buffer;
  if (enrollment.admissionLetterPdfUrl) {
    try {
      const res = await fetch(enrollment.admissionLetterPdfUrl);
      if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
      pdf = Buffer.from(await res.arrayBuffer());
    } catch (err) {
      console.error(`Fetching stored admission letter PDF failed for enrollment ${enrollment.id}:`, err);
      return false;
    }
  } else {
    try {
      pdf = await generateAdmissionLetterPdf({
        enrollmentId: enrollment.id,
        admittedAt: enrollment.admissionLetterSentAt ?? enrollment.createdAt,
        candidateName: enrollment.candidateName,
        candidateEmail: enrollment.candidateEmail,
        candidatePhone: enrollment.candidatePhone,
        programName,
        totalFeePaise: enrollment.totalFee,
      });
    } catch (err) {
      console.error(`Regenerating legacy admission letter PDF failed for enrollment ${enrollment.id}:`, err);
      return false;
    }
  }

  const attachments = [{ filename: `Admission-Letter-${enrollment.id}.pdf`, content: pdf, contentType: "application/pdf" }];

  return sendMail({
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
}
