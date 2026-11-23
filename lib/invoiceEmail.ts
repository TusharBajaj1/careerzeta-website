import { put } from "@vercel/blob";

import { CONTACT, PROGRAMS } from "@/lib/content";
import type { Enrollment, Payment } from "@/lib/db/schema";
import { uploadToDrive } from "@/lib/googleDrive";
import { generateInvoicePdf, invoiceLineLabel } from "@/lib/invoice";
import { nextInvoiceNumber } from "@/lib/invoiceNumber";
import { sendMail } from "@/lib/mailer";
import { formatPaiseAsInr } from "@/lib/money";

/** Persists the exact PDF that was emailed, so a later resend/download returns the same document instead of a live-regenerated one. Never throws — a storage failure shouldn't block the email that already went out. Also mirrors it into Google Drive for accounting, best-effort (no-ops silently if Drive sync isn't configured). */
async function storeInvoicePdf(invoiceNumber: string, pdf: Buffer): Promise<string | null> {
  const safeName = invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, "-");

  // Run in parallel, not sequentially — but still awaited (not fire-and-forget),
  // since Vercel can tear down the function as soon as it returns, which
  // would silently drop an un-awaited upload.
  const [blobResult] = await Promise.all([
    put(`invoices/${safeName}.pdf`, pdf, { access: "public", contentType: "application/pdf", addRandomSuffix: false }).catch(
      (err) => {
        console.error(`Storing invoice PDF failed for ${invoiceNumber}:`, err);
        return null;
      },
    ),
    uploadToDrive("Invoices", `${safeName}.pdf`, pdf),
  ]);

  return blobResult?.url ?? null;
}

/**
 * Generates the invoice PDF and persists it (blob + Drive) — does NOT
 * email anyone. Issues a fresh invoice number only when this payment
 * doesn't already have a usable one on file (none yet, or the existing
 * one was cancelled); otherwise reuses the existing (not-yet-sent)
 * number rather than burning a new one on every regenerate. Pairs with
 * resendExistingInvoice below, which is the only thing that actually
 * emails this document — generating and sending are deliberately two
 * separate manual steps, so nothing goes to a candidate just because an
 * invoice was produced.
 */
export async function generateInvoice(
  payment: Payment,
  enrollment: Enrollment,
): Promise<{ invoiceNumber: string; pdfUrl: string | null }> {
  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;

  let invoiceNumber: string;
  let pdf: Buffer;
  try {
    invoiceNumber =
      payment.invoiceNumber && !payment.invoiceCancelled ? payment.invoiceNumber : await nextInvoiceNumber();
    pdf = await generateInvoicePdf({
      invoiceNumber,
      issuedAt: payment.paidAt ?? new Date(),
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
  } catch (err) {
    console.error(`Invoice generation failed for payment ${payment.id}:`, err);
    return { invoiceNumber: "", pdfUrl: null };
  }

  const pdfUrl = await storeInvoicePdf(invoiceNumber, pdf);
  return { invoiceNumber, pdfUrl };
}

/**
 * Re-sends the exact invoice already on file for this payment (same number,
 * same document) — for when a candidate asks for another copy. Prefers the
 * stored PDF; falls back to regenerating from the enrollment's current
 * details for an invoice issued before PDFs were persisted (safe in the
 * common case, since candidate/fee details lock once a payment exists —
 * but could differ if this payment has since been reassigned to a
 * different enrollment, see /api/admin/payments/[id]/reassign).
 */
export async function resendExistingInvoice(payment: Payment, enrollment: Enrollment): Promise<boolean> {
  if (!payment.invoiceNumber) return false;

  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;

  let pdf: Buffer;
  if (payment.invoicePdfUrl) {
    try {
      const res = await fetch(payment.invoicePdfUrl);
      if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
      pdf = Buffer.from(await res.arrayBuffer());
    } catch (err) {
      console.error(`Fetching stored invoice PDF failed for payment ${payment.id}:`, err);
      return false;
    }
  } else {
    try {
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
    } catch (err) {
      console.error(`Regenerating legacy invoice PDF failed for payment ${payment.id}:`, err);
      return false;
    }
  }

  const label = invoiceLineLabel(payment.type, payment.amount, enrollment.amountPaid, enrollment.totalFee);
  const remaining = enrollment.totalFee - enrollment.amountPaid;
  const attachments = [{ filename: `${payment.invoiceNumber}.pdf`, content: pdf, contentType: "application/pdf" }];

  return sendMail({
    to: enrollment.candidateEmail,
    cc: CONTACT.email,
    subject: `Invoice ${payment.invoiceNumber} — ${programName}`,
    text: [
      `Hi ${enrollment.candidateName},`,
      ``,
      `Here's a copy of your invoice for ${formatPaiseAsInr(payment.amount)} (${label}) — ${programName}.`,
      remaining > 0
        ? `Balance remaining: ${formatPaiseAsInr(remaining)}.`
        : `Your course fee is paid in full.`,
      ``,
      `Questions? Reach us at ${CONTACT.email}.`,
      ``,
      `— Team CareerZeta`,
    ].join("\n"),
    attachments,
  });
}

/**
 * Re-renders this invoice's PDF from current data under its existing
 * invoice number and pushes the result to blob storage + Drive — doesn't
 * email anyone and doesn't touch invoiceSent/invoiceCancelled. For when a
 * template/wording bug is fixed after invoices have already been issued:
 * lets the admin refresh just the stored/Drive copy of a specific invoice
 * without re-issuing it or changing its number. Deliberately a manual,
 * one-invoice-at-a-time action rather than a bulk job — regenerating from
 * today's enrollment.amountPaid/totalFee is only correct for whichever
 * invoice is the LATEST one for that enrollment; an older invoice's
 * "total paid to date" would come out wrong if later payments have been
 * made since, so the admin picks which ones are safe to refresh.
 */
export async function refreshInvoiceDriveCopy(
  payment: Payment,
  enrollment: Enrollment,
): Promise<{ ok: boolean; pdfUrl: string | null; error?: string }> {
  if (!payment.invoiceNumber) return { ok: false, pdfUrl: null, error: "no_invoice" };

  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;

  let pdf: Buffer;
  try {
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
  } catch (err) {
    console.error(`Refreshing invoice PDF failed for payment ${payment.id}:`, err);
    return { ok: false, pdfUrl: null, error: "generation_failed" };
  }

  // Deliberately not storeInvoicePdf here — that helper discards Drive's
  // own success/failure (by design, for the normal send flow where Drive
  // being unconfigured shouldn't block anything). This action exists
  // specifically to fix a Drive copy, so its caller needs to know whether
  // Drive itself actually succeeded, not just whether blob storage did.
  const safeName = payment.invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, "-");
  const [blobResult, driveResult] = await Promise.all([
    put(`invoices/${safeName}.pdf`, pdf, { access: "public", contentType: "application/pdf", addRandomSuffix: false }).catch(
      (err) => {
        console.error(`Storing invoice PDF failed for ${payment.invoiceNumber}:`, err);
        return null;
      },
    ),
    uploadToDrive("Invoices", `${safeName}.pdf`, pdf),
  ]);

  if (!driveResult.ok) {
    return { ok: false, pdfUrl: blobResult?.url ?? null, error: driveResult.error ?? "drive_upload_failed" };
  }
  return { ok: true, pdfUrl: blobResult?.url ?? null };
}

/**
 * Notifies someone that an invoice they received was issued in error and
 * is void — for when a payment gets reassigned off their enrollment onto
 * the correct one (see /api/admin/payments/[id]/reassign). Deliberately
 * doesn't claim a corrected invoice is coming; whether/how to issue one
 * (e.g. a credit note) is an accounting decision made separately.
 */
export async function sendInvoiceCancellationNotice(params: {
  candidateName: string;
  candidateEmail: string;
  invoiceNumber: string;
}): Promise<boolean> {
  const { candidateName, candidateEmail, invoiceNumber } = params;

  const candidateSent = await sendMail({
    to: candidateEmail,
    subject: `Invoice ${invoiceNumber} — Cancelled`,
    text: [
      `Hi ${candidateName},`,
      ``,
      `We're writing to let you know that invoice ${invoiceNumber}, which you received from us, was issued in error. Please consider it cancelled — no payment or action is needed from you.`,
      ``,
      `We're sorry for the confusion. If you have any questions, reach us at ${CONTACT.email}.`,
      ``,
      `— Team CareerZeta`,
    ].join("\n"),
  });

  await sendMail({
    to: CONTACT.email,
    subject: `[Accounting] Invoice ${invoiceNumber} cancellation notice sent — ${candidateName}`,
    text: [
      `A cancellation notice for invoice ${invoiceNumber} was sent to ${candidateName} (${candidateEmail}).`,
      `This invoice was issued against an enrollment a payment was later reassigned away from.`,
    ].join("\n"),
  });

  return candidateSent;
}
