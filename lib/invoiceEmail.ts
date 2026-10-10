import { CONTACT, PROGRAMS } from "@/lib/content";
import type { Enrollment, Payment } from "@/lib/db/schema";
import { generateInvoicePdf } from "@/lib/invoice";
import { sendMail } from "@/lib/mailer";
import { formatPaiseAsInr } from "@/lib/money";

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
): Promise<{ invoiceNumber: string; sent: boolean }> {
  const invoiceNumber = `CZ-INV-${String(payment.id).padStart(6, "0")}`;
  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;

  let pdf: Buffer;
  try {
    pdf = await generateInvoicePdf({
      invoiceNumber,
      issuedAt: payment.paidAt ?? new Date(),
      candidateName: enrollment.candidateName,
      candidateEmail: enrollment.candidateEmail,
      candidatePhone: enrollment.candidatePhone,
      programName,
      paymentType: payment.type,
      amountPaidNowPaise: payment.amount,
      totalFeePaise: enrollment.totalFee,
      amountPaidTotalPaise: enrollment.amountPaid,
    });
  } catch (err) {
    console.error(`Invoice PDF generation failed for payment ${payment.id}:`, err);
    return { invoiceNumber, sent: false };
  }

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

  return { invoiceNumber, sent: candidateSent };
}
