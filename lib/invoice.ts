import PDFDocument from "pdfkit";

import { COMPANY, GST_RATE_PERCENT, SERVICE_SAC_CODE } from "@/lib/company";
import { stateCodeFor } from "@/lib/indianStates";
import { paiseToRupees } from "@/lib/money";
import { BRAND_COLORS, BRAND_FONTS, drawEyebrow, drawLetterhead, registerBrandFonts } from "@/lib/pdfBrand";

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
 * The stored `type` on a payment is just whichever option the admin picked
 * when creating its link (case-by-case, not derived) — so it can say
 * "Balance Payment" or "Registration Fee" even when this one transaction,
 * by itself, took the candidate from nothing paid to fully paid (e.g. the
 * registration-fee split was never actually used for them). Whenever that's
 * what actually happened, the invoice should say "Course Fee" regardless of
 * what the link was labeled internally.
 */
export function invoiceLineLabel(
  paymentType: InvoiceData["paymentType"],
  amountPaidNowPaise: number,
  amountPaidTotalPaise: number,
  totalFeePaise: number,
): string {
  const amountBeforeThisPayment = amountPaidTotalPaise - amountPaidNowPaise;
  if (amountBeforeThisPayment <= 0 && amountPaidNowPaise >= totalFeePaise) {
    return PAYMENT_TYPE_LABEL.full;
  }
  return PAYMENT_TYPE_LABEL[paymentType];
}

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

    registerBrandFonts(doc);

    const gst = computeGst(data.amountPaidNowPaise, data.candidateState);
    const candidateStateCode = data.candidateState ? stateCodeFor(data.candidateState) : null;
    const label = invoiceLineLabel(
      data.paymentType,
      data.amountPaidNowPaise,
      data.amountPaidTotalPaise,
      data.totalFeePaise,
    );
    const remaining = data.totalFeePaise - data.amountPaidTotalPaise;
    const tableRight = 545;

    const letterheadBottom = drawLetterhead(doc, {
      addressLines: COMPANY.addressLines,
      extraLine: `GSTIN: ${COMPANY.gstin} · State: ${COMPANY.state} (Code ${COMPANY.stateCode})`,
      contentLeft: 50,
      contentRight: tableRight,
    });
    doc.y = letterheadBottom;

    drawEyebrow(doc, "Tax Invoice", 50, doc.y);
    doc.moveDown(1.1);

    // Invoice meta + bill-to, side by side
    const colLeftX = 50;
    const colRightX = 320;
    const metaTop = doc.y;

    drawEyebrow(doc, "Invoice Details", colLeftX, metaTop);
    doc.font(BRAND_FONTS.body).fontSize(9).fillColor(BRAND_COLORS.charcoal);
    doc.text(`Invoice #: ${data.invoiceNumber}`, colLeftX, metaTop + 14);
    doc.text(
      `Date: ${data.issuedAt.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
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
    doc.y = Math.max(doc.y, metaTop + 14 + 5 * 12) + 18;

    // Line-item table — header band in the brand's rounded-tint treatment.
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
    const description = `${label} — ${data.programName}`;
    // Row height follows however many lines the (potentially long) program
    // name wraps to, so the divider below never overlaps the text.
    doc.font(BRAND_FONTS.body).fontSize(9);
    const descHeight = doc.heightOfString(description, { width: descWidth });
    const rowHeight = Math.max(descHeight, 11);

    doc.fillColor(BRAND_COLORS.charcoal);
    doc.text(description, col.desc, rowY, { width: descWidth });
    doc.text(SERVICE_SAC_CODE, col.sac, rowY, { width: col.taxable - col.sac - 5 });
    doc.text(formatInr(gst.taxableValuePaise), col.taxable, rowY, { width: col.tax - col.taxable - 5 });
    doc.text(`${GST_RATE_PERCENT}%`, col.tax, rowY, { width: col.total - col.tax - 5 });
    doc.text(formatInr(data.amountPaidNowPaise), col.total, rowY, { width: tableRight - col.total });

    const dividerY = rowY + rowHeight + 6;
    doc.moveTo(col.desc, dividerY).lineTo(tableRight, dividerY).strokeColor("#cbd5e1").stroke();

    // Tax breakdown
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
    doc.text("Total invoice value", 350, y, { width: 100 });
    doc.text(formatInr(data.amountPaidNowPaise), col.total, y, { width: tableRight - col.total });
    y += 26;

    // Payment status summary
    doc.font(BRAND_FONTS.body).fontSize(9).fillColor(BRAND_COLORS.charcoal);
    doc.text(`Total program fee: ${formatInr(data.totalFeePaise)}`, 50, y);
    y += 14;
    doc.text(`Total paid to date: ${formatInr(data.amountPaidTotalPaise)}`, 50, y);
    y += 14;
    if (remaining > 0) {
      doc.text(`Balance remaining: ${formatInr(remaining)}`, 50, y);
    } else {
      doc.font(BRAND_FONTS.bodyBold).fillColor("#166534").text("Status: Paid in full", 50, y);
    }

    doc.moveDown(3);
    doc
      .fontSize(8)
      .fillColor(BRAND_COLORS.muted)
      .font(BRAND_FONTS.body)
      .text(
        "This is a system-generated tax invoice and does not require a physical signature. For queries, contact hello@careerzeta.com.",
        50,
        doc.y,
        { align: "center", width: tableRight - 50 },
      );

    doc.end();
  });
}
