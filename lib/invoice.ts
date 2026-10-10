import PDFDocument from "pdfkit";

import { paiseToRupees } from "@/lib/money";

/**
 * PDFKit's standard fonts (Helvetica etc.) only cover WinAnsi/Latin-1, which
 * excludes the ₹ glyph (U+20B9) — it renders as a stray superscript "1"
 * without embedding a custom Unicode font. "Rs." avoids that entirely.
 */
function formatInr(paise: number): string {
  return `Rs. ${paiseToRupees(paise).toLocaleString("en-IN")}`;
}

export type InvoiceData = {
  invoiceNumber: string;
  issuedAt: Date;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  programName: string;
  paymentType: "full" | "registration" | "balance";
  amountPaidNowPaise: number;
  totalFeePaise: number;
  amountPaidTotalPaise: number;
};

const PAYMENT_TYPE_LABEL: Record<InvoiceData["paymentType"], string> = {
  full: "Course Fee",
  registration: "Registration Fee",
  balance: "Balance Payment",
};

export function generateInvoicePdf(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).font("Helvetica-Bold").fillColor("#111827").text("CareerZeta");
    doc.fontSize(10).font("Helvetica").fillColor("#555555").text("www.careerzeta.com");
    doc.moveDown(1.5);

    doc.fontSize(14).font("Helvetica-Bold").fillColor("#111827").text("Payment Invoice");
    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    doc.text(`Invoice #: ${data.invoiceNumber}`);
    doc.text(
      `Date: ${data.issuedAt.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
    );
    doc.moveDown();

    doc.font("Helvetica-Bold").text("Billed To");
    doc.font("Helvetica").text(data.candidateName);
    doc.text(data.candidateEmail);
    doc.text(data.candidatePhone);
    doc.moveDown();

    doc.font("Helvetica-Bold").text("Program");
    doc.font("Helvetica").text(data.programName);
    doc.moveDown();

    const label = PAYMENT_TYPE_LABEL[data.paymentType];
    const remaining = data.totalFeePaise - data.amountPaidTotalPaise;

    doc.font("Helvetica-Bold").text("Payment Details");
    doc.font("Helvetica");
    doc.text(`${label}: ${formatInr(data.amountPaidNowPaise)}`);
    doc.moveDown(0.5);
    doc.text(`Total Program Fee: ${formatInr(data.totalFeePaise)}`);
    doc.text(`Total Paid to Date: ${formatInr(data.amountPaidTotalPaise)}`);

    if (remaining > 0) {
      doc.text(`Balance Remaining: ${formatInr(remaining)}`);
    } else {
      doc.moveDown(0.3);
      doc.font("Helvetica-Bold").fillColor("#0a7a0a").text("Status: Paid in Full");
    }

    doc.moveDown(2);
    doc
      .fontSize(9)
      .fillColor("#888888")
      .font("Helvetica")
      .text("This is a system-generated invoice. For queries, contact hello@careerzeta.com.", {
        align: "center",
      });

    doc.end();
  });
}
