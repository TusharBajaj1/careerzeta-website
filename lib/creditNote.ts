import PDFDocument from "pdfkit";

import { COMPANY, GST_RATE_PERCENT, SERVICE_SAC_CODE } from "@/lib/company";
import { computeGst, formatInr } from "@/lib/invoice";
import { stateCodeFor } from "@/lib/indianStates";
import { BRAND_COLORS, BRAND_FONTS, drawEyebrow, drawLetterhead, registerBrandFonts } from "@/lib/pdfBrand";

export type CreditNoteData = {
  creditNoteNumber: string;
  issuedAt: Date;
  /** The invoice this note reverses — always in full, for now. */
  originalInvoiceNumber: string;
  originalInvoiceDate: Date;
  reason: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateState: string | null;
  candidateAddress?: string | null;
  candidateGstin?: string | null;
  programName: string;
  /** GST-inclusive amount being credited, in paise — matches the original invoice's line amount. */
  amountPaise: number;
};

/** Same letterhead/GST-table treatment as the tax invoice, with a "Credit Note" eyebrow, a reference back to the original invoice, and the stated reason instead of a payment-status summary. */
export function generateCreditNotePdf(data: CreditNoteData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    registerBrandFonts(doc);

    const gst = computeGst(data.amountPaise, data.candidateState);
    const candidateStateCode = data.candidateState ? stateCodeFor(data.candidateState) : null;
    const tableRight = 545;

    const letterheadBottom = drawLetterhead(doc, {
      addressLines: COMPANY.addressLines,
      extraLine: `GSTIN: ${COMPANY.gstin} · State: ${COMPANY.state} (Code ${COMPANY.stateCode})`,
      contentLeft: 50,
      contentRight: tableRight,
    });
    doc.y = letterheadBottom;

    drawEyebrow(doc, "Credit Note", 50, doc.y);
    doc.moveDown(1.1);

    const colLeftX = 50;
    const colRightX = 320;
    const metaTop = doc.y;

    drawEyebrow(doc, "Credit Note Details", colLeftX, metaTop);
    doc.font(BRAND_FONTS.body).fontSize(9).fillColor(BRAND_COLORS.charcoal);
    doc.text(`Credit Note #: ${data.creditNoteNumber}`, colLeftX, metaTop + 14);
    doc.text(
      `Date: ${data.issuedAt.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
      colLeftX,
    );
    doc.text(`Against Invoice #: ${data.originalInvoiceNumber}`, colLeftX);
    doc.text(
      `Invoice Date: ${data.originalInvoiceDate.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
      colLeftX,
    );
    doc.text(`Place of supply: ${data.candidateState ?? "—"}${candidateStateCode ? ` (${candidateStateCode})` : ""}`, colLeftX);

    drawEyebrow(doc, "Billed To", colRightX, metaTop);
    doc.font(BRAND_FONTS.body).fontSize(9).fillColor(BRAND_COLORS.charcoal);
    doc.text(data.candidateName, colRightX, metaTop + 14);
    doc.text(data.candidateEmail, colRightX);
    doc.text(data.candidatePhone, colRightX);
    if (data.candidateAddress) {
      doc.text(data.candidateAddress, colRightX, undefined, { width: tableRight - colRightX });
    }
    if (data.candidateState) doc.text(data.candidateState, colRightX);
    if (data.candidateGstin) doc.text(`GSTIN: ${data.candidateGstin}`, colRightX);

    doc.x = colLeftX;
    doc.y = Math.max(doc.y, metaTop + 14 + 6 * 12) + 18;

    const tableTop = doc.y;
    const col = { desc: 50, sac: 300, taxable: 345, tax: 430, total: 475 };
    const descWidth = col.sac - col.desc - 8;
    const headerHeight = 22;

    doc.roundedRect(colLeftX, tableTop, tableRight - colLeftX, headerHeight, 6).fill(BRAND_COLORS.tintBlue);
    doc.font(BRAND_FONTS.bodyBold).fontSize(8.5).fillColor(BRAND_COLORS.deepAqua);
    const headerTextY = tableTop + 7;
    doc.text("DESCRIPTION", col.desc + 8, headerTextY, { width: descWidth - 8 });
    doc.text("SAC", col.sac, headerTextY, { width: col.taxable - col.sac - 5 });
    doc.text("TAXABLE VALUE", col.taxable, headerTextY, { width: col.tax - col.taxable - 5 });
    doc.text("GST", col.tax, headerTextY, { width: col.total - col.tax - 5 });
    doc.text("TOTAL", col.total, headerTextY, { width: tableRight - 8 - col.total });

    const rowY = tableTop + headerHeight + 8;
    const description = `Credit against Invoice ${data.originalInvoiceNumber} — ${data.programName}`;
    doc.font(BRAND_FONTS.body).fontSize(9);
    const descHeight = doc.heightOfString(description, { width: descWidth });
    const rowHeight = Math.max(descHeight, 11);

    doc.fillColor(BRAND_COLORS.charcoal);
    doc.text(description, col.desc, rowY, { width: descWidth });
    doc.text(SERVICE_SAC_CODE, col.sac, rowY, { width: col.taxable - col.sac - 5 });
    doc.text(formatInr(gst.taxableValuePaise), col.taxable, rowY, { width: col.tax - col.taxable - 5 });
    doc.text(`${GST_RATE_PERCENT}%`, col.tax, rowY, { width: col.total - col.tax - 5 });
    doc.text(formatInr(data.amountPaise), col.total, rowY, { width: tableRight - col.total });

    const dividerY = rowY + rowHeight + 6;
    doc.moveTo(col.desc, dividerY).lineTo(tableRight, dividerY).strokeColor("#cbd5e1").stroke();

    let y = dividerY + 10;
    doc.font(BRAND_FONTS.body).fontSize(9).fillColor(BRAND_COLORS.charcoal);
    const taxLine = (textLabel: string, amountPaise: number) => {
      doc.text(textLabel, 350, y, { width: 100 });
      doc.text(formatInr(amountPaise), col.total, y, { width: tableRight - col.total });
      y += 14;
    };
    doc.text("Taxable value", 350, y, { width: 100 });
    doc.text(formatInr(gst.taxableValuePaise), col.total, y, { width: tableRight - col.total });
    y += 14;
    if (gst.isIntraState) {
      taxLine(`CGST @ ${GST_RATE_PERCENT / 2}%`, gst.cgstPaise);
      taxLine(`SGST @ ${GST_RATE_PERCENT / 2}%`, gst.sgstPaise);
    } else {
      taxLine(`IGST @ ${GST_RATE_PERCENT}%`, gst.igstPaise);
    }
    doc.font(BRAND_FONTS.bodyBold).fillColor(BRAND_COLORS.deepAqua);
    doc.text("Total credit note value", 350, y, { width: 100 });
    doc.text(formatInr(data.amountPaise), col.total, y, { width: tableRight - col.total });
    y += 26;

    doc.font(BRAND_FONTS.bodyBold).fontSize(9).fillColor(BRAND_COLORS.charcoal);
    doc.text("Reason for credit note", 50, y);
    y += 14;
    doc.font(BRAND_FONTS.body);
    doc.text(data.reason, 50, y, { width: tableRight - 50 });
    y = doc.y + 12;

    doc.moveDown(2);
    doc
      .fontSize(8)
      .fillColor(BRAND_COLORS.muted)
      .font(BRAND_FONTS.body)
      .text(
        "This is a system-generated credit note and does not require a physical signature. For queries, contact hello@careerzeta.com.",
        50,
        Math.max(doc.y, y),
        { align: "center", width: tableRight - 50 },
      );

    doc.end();
  });
}
