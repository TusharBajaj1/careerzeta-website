import { put } from "@vercel/blob";

import { CONTACT, PROGRAMS } from "@/lib/content";
import type { Enrollment, Payment } from "@/lib/db/schema";
import { generateInvoicePdf } from "@/lib/invoice";
import { nextInvoiceNumber } from "@/lib/invoiceNumber";
import { sendMail } from "@/lib/mailer";
import { formatPaiseAsInr } from "@/lib/money";

/** Persists the exact PDF that was emailed, so a later resend/download returns the same document instead of a live-regenerated one. Never throws — a storage failure shouldn't block the email that already went out. */
async function storeInvoicePdf(invoiceNumber: string, pdf: Buffer): Promise<string | null> {
  try {
    const safeName = invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, "-");
    const blob = await put(`invoices/${safeName}.pdf`, pdf, {
      access: "public",
      contentType: "application/pdf",
      addRandomSuffix: false,
    });
    return blob.url;
  } catch (err) {
    console.error(`Storing invoice PDF failed for ${invoiceNumber}:`, err);
    return null;
  }
}

const PAYMENT_TYPE_LABEL: Record<Payment["type"], string> = {
  full: "Course Fee",
  registration: "Registration Fee",
  balance: "Balance Payment",
};

/**
 * Generates the invoice PDF and emails it to the candidate and to
 * CONTACT.email (the accounting inbox), for recordkeeping. Never throws —
 * email/PDF failures are logged and reflected in the returned `sent` flag
 * rather than blocking the payment-confirmation flow that calls this.
 */
export async function sendPaymentInvoice(
  payment: Payment,
  enrollment: Enrollment,
): Promise<{ invoiceNumber: string; sent: boolean; pdfUrl: string | null }> {
  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;

  let invoiceNumber: string;
  let pdf: Buffer;
  try {
    invoiceNumber = await nextInvoiceNumber();
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
    return { invoiceNumber: "", sent: false, pdfUrl: null };
  }

  const pdfUrl = await storeInvoicePdf(invoiceNumber, pdf);
  const attachments = [{ filename: `${invoiceNumber}.pdf`, content: pdf, contentType: "application/pdf" }];
  const label = PAYMENT_TYPE_LABEL[payment.type];
  const remaining = enrollment.totalFee - enrollment.amountPaid;

  const candidateSent = await sendMail({
    to: enrollment.candidateEmail,
    subject: `Invoice ${invoiceNumber} — ${programName}`,
    text: [
      `Hi ${enrollment.candidateName},`,
      ``,
      `We've received your payment of ${formatPaiseAsInr(payment.amount)} (${label}) for ${programName}.`,
      remaining > 0
        ? `Balance remaining: ${formatPaiseAsInr(remaining)}.`
        : `Your course fee is now paid in full.`,
      ``,
      `Your invoice is attached. Questions? Reach us at ${CONTACT.email}.`,
      ``,
      `— Team CareerZeta`,
    ].join("\n"),
    attachments,
  });

  await sendMail({
    to: CONTACT.email,
    subject: `[Accounting] Invoice ${invoiceNumber} — ${enrollment.candidateName}`,
    text: [
      `Payment recorded for ${enrollment.candidateName} (${enrollment.candidateEmail}, ${enrollment.candidatePhone}).`,
      `Program: ${programName}`,
      `Type: ${label}`,
      `Amount: ${formatPaiseAsInr(payment.amount)}`,
      `Total paid to date: ${formatPaiseAsInr(enrollment.amountPaid)} of ${formatPaiseAsInr(enrollment.totalFee)}`,
      `Enrollment ID: ${enrollment.id} / Payment ID: ${payment.id}`,
    ].join("\n"),
    attachments,
  });

  return { invoiceNumber, sent: candidateSent, pdfUrl };
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

  const label = PAYMENT_TYPE_LABEL[payment.type];
  const remaining = enrollment.totalFee - enrollment.amountPaid;
  const attachments = [{ filename: `${payment.invoiceNumber}.pdf`, content: pdf, contentType: "application/pdf" }];

  return sendMail({
    to: enrollment.candidateEmail,
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
