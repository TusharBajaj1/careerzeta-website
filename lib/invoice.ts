import PDFDocument from "pdfkit";

import { COMPANY, GST_RATE_PERCENT, SERVICE_SAC_CODE } from "@/lib/company";
import { stateCodeFor } from "@/lib/indianStates";
import { paiseToRupees } from "@/lib/money";

export type InvoiceData = {
  invoiceNumber: string;
  issuedAt: Date;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateState: string | null;
  candidateAddress?: string | null;
  candidateGstin?: string | null;
  programName: string;
  paymentType: "full" | "registration" | "balance";
  /** GST-inclusive amount for this specific transaction, in paise — program fees are quoted inclusive of all taxes. */
  amountPaidNowPaise: number;
  totalFeePaise: number;
  amountPaidTotalPaise: number;
};

const PAYMENT_TYPE_LABEL: Record<InvoiceData["paymentType"], string> = {
  full: "Course Fee",
  registration: "Registration Fee",
  balance: "Balance Payment",
};

/**
 * PDFKit's standard fonts (Helvetica etc.) only cover WinAnsi/Latin-1, which
 * excludes the ₹ glyph (U+20B9) — it renders as a stray superscript "1"
 * without embedding a custom Unicode font. "Rs." avoids that entirely.
 */
function formatInr(paise: number): string {
  return `Rs. ${paiseToRupees(paise).toLocaleString("en-IN")}`;
}

type GstBreakdown = {
  taxableValuePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  isIntraState: boolean;
};

/** Backs the taxable value and GST split out of a GST-inclusive total, per the candidate's state vs CareerZeta's (Uttar Pradesh). */
function computeGst(totalInclusivePaise: number, candidateState: string | null): GstBreakdown {
  const taxableValuePaise = Math.round(totalInclusivePaise / (1 + GST_RATE_PERCENT / 100));
  const gstAmountPaise = totalInclusivePaise - taxableValuePaise;
  const isIntraState = candidateState === COMPANY.state;

  if (isIntraState) {
    const cgstPaise = Math.round(gstAmountPaise / 2);
    return { taxableValuePaise, cgstPaise, sgstPaise: gstAmountPaise - cgstPaise, igstPaise: 0, isIntraState };
  }
  return { taxableValuePaise, cgstPaise: 0, sgstPaise: 0, igstPaise: gstAmountPaise, isIntraState };
}

export function generateInvoicePdf(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const gst = computeGst(data.amountPaidNowPaise, data.candidateState);
    const candidateStateCode = data.candidateState ? stateCodeFor(data.candidateState) : null;
    const label = PAYMENT_TYPE_LABEL[data.paymentType];
    const remaining = data.totalFeePaise - data.amountPaidTotalPaise;

    // Header
    doc.fontSize(18).font("Helvetica-Bold").fillColor("#111827").text(COMPANY.legalName);
    doc.fontSize(9).font("Helvetica").fillColor("#555555");
    for (const line of COMPANY.addressLines) doc.text(line);
    doc.text(`GSTIN: ${COMPANY.gstin}  |  State: ${COMPANY.state} (Code ${COMPANY.stateCode})`);
    doc.moveDown(1);

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("TAX INVOICE", { align: "center" });
    doc.moveDown(0.8);

    // Invoice meta + bill-to, side by side
    const colLeftX = doc.x;
    const colRightX = 320;
    const metaTop = doc.y;

    doc.fontSize(9).font("Helvetica-Bold").fillColor("#111827").text("Invoice Details", colLeftX, metaTop);
    doc.font("Helvetica");
    doc.text(`Invoice #: ${data.invoiceNumber}`, colLeftX);
    doc.text(
      `Date: ${data.issuedAt.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
      colLeftX,
    );
    doc.text(`Place of Supply: ${data.candidateState ?? "—"}${candidateStateCode ? ` (${candidateStateCode})` : ""}`, colLeftX);

    doc.fontSize(9).font("Helvetica-Bold").text("Billed To", colRightX, metaTop);
    doc.font("Helvetica");
    doc.text(data.candidateName, colRightX);
    doc.text(data.candidateEmail, colRightX);
    doc.text(data.candidatePhone, colRightX);
    if (data.candidateAddress) {
      doc.text(data.candidateAddress, colRightX, undefined, { width: 200 });
    }
    if (data.candidateState) doc.text(data.candidateState, colRightX);
    if (data.candidateGstin) doc.text(`GSTIN: ${data.candidateGstin}`, colRightX);

    doc.x = colLeftX;
    doc.moveDown(1.5);

    // Line-item table
    const tableTop = doc.y;
    const col = { desc: 50, sac: 300, taxable: 345, tax: 430, total: 475 };
    const tableRight = 545;
    const descWidth = col.sac - col.desc - 8;

    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Description", col.desc, tableTop, { width: descWidth });
    doc.text("SAC", col.sac, tableTop, { width: col.taxable - col.sac - 5 });
    doc.text("Taxable Value", col.taxable, tableTop, { width: col.tax - col.taxable - 5 });
    doc.text("GST", col.tax, tableTop, { width: col.total - col.tax - 5 });
    doc.text("Total", col.total, tableTop, { width: tableRight - col.total });

    doc
      .moveTo(col.desc, tableTop + 14)
      .lineTo(tableRight, tableTop + 14)
      .strokeColor("#cccccc")
      .stroke();

    const rowY = tableTop + 20;
    const description = `${label} — ${data.programName}`;
    // Row height follows however many lines the (potentially long) program
    // name wraps to, so the divider below never overlaps the text.
    const descHeight = doc.font("Helvetica").fontSize(9).heightOfString(description, { width: descWidth });
    const rowHeight = Math.max(descHeight, 11);

    doc.text(description, col.desc, rowY, { width: descWidth });
    doc.text(SERVICE_SAC_CODE, col.sac, rowY, { width: col.taxable - col.sac - 5 });
    doc.text(formatInr(gst.taxableValuePaise), col.taxable, rowY, { width: col.tax - col.taxable - 5 });
    doc.text(`${GST_RATE_PERCENT}%`, col.tax, rowY, { width: col.total - col.tax - 5 });
    doc.text(formatInr(data.amountPaidNowPaise), col.total, rowY, { width: tableRight - col.total });

    const dividerY = rowY + rowHeight + 6;
    doc
      .moveTo(col.desc, dividerY)
      .lineTo(tableRight, dividerY)
      .strokeColor("#cccccc")
      .stroke();

    // Tax breakdown
    let y = dividerY + 10;
    doc.fontSize(9);
    const taxLine = (textLabel: string, amountPaise: number) => {
      doc.text(textLabel, 350, y, { width: 100 });
      doc.text(formatInr(amountPaise), col.total, y, { width: tableRight - col.total });
      y += 14;
    };
    doc.text("Taxable Value", 350, y, { width: 100 });
    doc.text(formatInr(gst.taxableValuePaise), col.total, y, { width: tableRight - col.total });
    y += 14;
    if (gst.isIntraState) {
      taxLine(`CGST @ ${GST_RATE_PERCENT / 2}%`, gst.cgstPaise);
      taxLine(`SGST @ ${GST_RATE_PERCENT / 2}%`, gst.sgstPaise);
    } else {
      taxLine(`IGST @ ${GST_RATE_PERCENT}%`, gst.igstPaise);
    }
    doc.font("Helvetica-Bold");
    doc.text("Total Invoice Value", 350, y, { width: 100 });
    doc.text(formatInr(data.amountPaidNowPaise), col.total, y, { width: tableRight - col.total });
    y += 24;

    // Payment status summary
    doc.font("Helvetica").fontSize(9).fillColor("#111827");
    doc.text(`Total Program Fee: ${formatInr(data.totalFeePaise)}`, 50, y);
    y += 14;
    doc.text(`Total Paid to Date: ${formatInr(data.amountPaidTotalPaise)}`, 50, y);
    y += 14;
    if (remaining > 0) {
      doc.text(`Balance Remaining: ${formatInr(remaining)}`, 50, y);
    } else {
      doc.font("Helvetica-Bold").fillColor("#0a7a0a").text("Status: Paid in Full", 50, y);
    }

    doc.moveDown(3);
    doc
      .fontSize(8)
      .fillColor("#888888")
      .font("Helvetica")
      .text(
        "This is a system-generated tax invoice and does not require a physical signature. For queries, contact hello@careerzeta.com.",
        50,
        doc.y,
        { align: "center", width: tableRight - 50 },
      );

    doc.end();
  });
}
