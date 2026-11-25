import { put } from "@vercel/blob";

import { CONTACT } from "@/lib/content";
import type { CreditNoteData } from "@/lib/creditNote";
import { generateCreditNotePdf } from "@/lib/creditNote";
import { uploadToDrive } from "@/lib/googleDrive";
import { formatPaiseAsInr } from "@/lib/money";
import { sendMail } from "@/lib/mailer";

/** Persists the generated PDF (blob + Drive), same pattern as storeInvoicePdf. */
async function storeCreditNotePdf(creditNoteNumber: string, pdf: Buffer): Promise<string | null> {
  const safeName = creditNoteNumber.replace(/[^a-zA-Z0-9_-]/g, "-");
  const [blobResult] = await Promise.all([
    put(`credit-notes/${safeName}.pdf`, pdf, { access: "public", contentType: "application/pdf", addRandomSuffix: false }).catch(
      (err) => {
        console.error(`Storing credit note PDF failed for ${creditNoteNumber}:`, err);
        return null;
      },
    ),
    uploadToDrive("Credit Notes", `${safeName}.pdf`, pdf),
  ]);

  return blobResult?.url ?? null;
}

/** Generates and stores the credit note PDF — does NOT email anyone. Sending is a separate, deliberate step (sendCreditNote below), same split as invoices. */
export async function generateAndStoreCreditNote(data: CreditNoteData): Promise<{ pdf: Buffer; pdfUrl: string | null }> {
  const pdf = await generateCreditNotePdf(data);
  const pdfUrl = await storeCreditNotePdf(data.creditNoteNumber, pdf);
  return { pdf, pdfUrl };
}

/** Emails the already-generated credit note PDF to the candidate (cc'd to CONTACT.email) — fetches the stored copy so it's the exact document on file, not a live regeneration. */
export async function sendCreditNote(params: {
  creditNoteNumber: string;
  pdfUrl: string;
  candidateName: string;
  candidateEmail: string;
  originalInvoiceNumber: string;
  amountPaise: number;
}): Promise<boolean> {
  const { creditNoteNumber, pdfUrl, candidateName, candidateEmail, originalInvoiceNumber, amountPaise } = params;

  let pdf: Buffer;
  try {
    const res = await fetch(pdfUrl);
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    pdf = Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.error(`Fetching stored credit note PDF failed for ${creditNoteNumber}:`, err);
    return false;
  }

  const attachments = [{ filename: `${creditNoteNumber}.pdf`, content: pdf, contentType: "application/pdf" }];

  return sendMail({
    to: candidateEmail,
    cc: CONTACT.email,
    subject: `Credit Note ${creditNoteNumber} — against Invoice ${originalInvoiceNumber}`,
    text: [
      `Hi ${candidateName},`,
      ``,
      `Please find attached credit note ${creditNoteNumber} for ${formatPaiseAsInr(amountPaise)}, issued against invoice ${originalInvoiceNumber}.`,
      ``,
      `Questions? Reach us at ${CONTACT.email}.`,
      ``,
      `— Team CareerZeta`,
    ].join("\n"),
    attachments,
  });
}
