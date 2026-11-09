import PDFDocument from "pdfkit";

import { COMPANY } from "@/lib/company";
import { formatPaiseAsInr } from "@/lib/money";
import { BRAND_COLORS, BRAND_FONTS, drawEyebrow, drawLetterhead, registerBrandFonts } from "@/lib/pdfBrand";

export type AdmissionLetterData = {
  /** Gapless ADM/000001-style reference — from enrollments.admissionNumber (assigned once, at first actual send) or an "ADM/DRAFT" placeholder for a preview of an enrollment that hasn't been sent one yet. The caller resolves which; this module just renders it. */
  admissionNumber: string;
  admittedAt: Date;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  programName: string;
  totalFeePaise: number;
  batchDetails?: string | null;
  /** The letter's editable message — from enrollments.admissionLetterBody, or lib/admissionLetterTemplate.ts's default when nothing's been customized. The caller resolves which, so this module stays pure rendering. */
  bodyText: string;
};

const CONTENT_LEFT = 50;
const CONTENT_RIGHT = 545;
const CONTENT_WIDTH = CONTENT_RIGHT - CONTENT_LEFT;

export function generateAdmissionLetterPdf(data: AdmissionLetterData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    registerBrandFonts(doc);

    const letterheadBottom = drawLetterhead(doc, {
      addressLines: COMPANY.addressLines,
      contentLeft: CONTENT_LEFT,
      contentRight: CONTENT_RIGHT,
    });
    doc.y = letterheadBottom;

    doc.font(BRAND_FONTS.body).fontSize(8.5).fillColor(BRAND_COLORS.muted);
    doc.text(
      `Ref: ${data.admissionNumber}  ·  Date: ${data.admittedAt.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
      CONTENT_LEFT,
    );
    doc.moveDown(1.2);

    drawEyebrow(doc, "Letter of Admission", CONTENT_LEFT, doc.y);
    doc.moveDown(1);

    doc.font(BRAND_FONTS.heading).fontSize(19).fillColor(BRAND_COLORS.charcoal);
    doc.text("Admission confirmed", CONTENT_LEFT);
    doc.moveDown(1);

    // Batch details — the brand's rounded tint card, shown up top so it's
    // the first thing a candidate sees once they know they're admitted.
    // Still shown (with a holding message) when nothing's been set yet,
    // so the letter never looks like it forgot to mention a batch.
    {
      const batchText = data.batchDetails || "We'll share your batch details with you shortly.";
      const cardX = CONTENT_LEFT;
      const cardTop = doc.y;
      const cardWidth = CONTENT_WIDTH;
      const textWidth = cardWidth - 32;

      doc.font(BRAND_FONTS.bodyBold).fontSize(10);
      const titleHeight = doc.heightOfString("Batch details", { width: textWidth });
      doc.font(BRAND_FONTS.body).fontSize(10);
      const bodyHeight = doc.heightOfString(batchText, { width: textWidth });
      const cardHeight = 16 + titleHeight + 6 + bodyHeight + 16;

      doc.roundedRect(cardX, cardTop, cardWidth, cardHeight, 14).fill(BRAND_COLORS.tintBlue);

      doc.font(BRAND_FONTS.bodyBold).fontSize(10).fillColor(BRAND_COLORS.deepAqua);
      doc.text("Batch details", cardX + 16, cardTop + 16, { width: textWidth });
      doc.font(BRAND_FONTS.body).fontSize(10).fillColor(BRAND_COLORS.charcoal);
      doc.text(batchText, cardX + 16, doc.y + 4, { width: textWidth });

      doc.y = cardTop + cardHeight + 18;
      doc.x = CONTENT_LEFT;
    }

    // The editable message — fully admin-controlled per enrollment (see
    // AdmissionLetterData.bodyText), rendered as plain paragraphs split on
    // blank lines.
    doc.font(BRAND_FONTS.body).fontSize(11).fillColor(BRAND_COLORS.charcoal);
    const paragraphs = data.bodyText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    for (const paragraph of paragraphs) {
      doc.text(paragraph, CONTENT_LEFT, doc.y, { width: CONTENT_WIDTH, align: "justify" });
      doc.moveDown(0.8);
    }
    doc.moveDown(0.4);

    doc.font(BRAND_FONTS.body).fontSize(11).fillColor(BRAND_COLORS.charcoal).text("Warm regards,", CONTENT_LEFT);
    doc.moveDown(0.3);
    doc.font(BRAND_FONTS.heading).fontSize(12).fillColor(BRAND_COLORS.charcoal).text("Team CareerZeta", CONTENT_LEFT);
    doc.font(BRAND_FONTS.body).fontSize(9).fillColor(BRAND_COLORS.muted).text(COMPANY.legalName, CONTENT_LEFT);
    doc.moveDown(1.5);

    // Candidate details — same rounded-card treatment as the batch card,
    // in the neutral tint so it doesn't compete with it for attention.
    const detailCardTop = doc.y;
    const detailLines = [
      `Name: ${data.candidateName}`,
      `Email: ${data.candidateEmail}`,
      `Phone: ${data.candidatePhone}`,
      `Program: ${data.programName}`,
      `Fee paid: ${formatPaiseAsInr(data.totalFeePaise)}`,
      `Admission ref: ${data.admissionNumber}`,
    ];
    doc.font(BRAND_FONTS.body).fontSize(9);
    const detailTextWidth = CONTENT_WIDTH - 32;
    const detailBodyHeight = detailLines.reduce((sum, line) => sum + doc.heightOfString(line, { width: detailTextWidth }), 0);
    const detailTitleHeight = 14;
    const detailCardHeight = 16 + detailTitleHeight + detailBodyHeight + 16;

    doc.roundedRect(CONTENT_LEFT, detailCardTop, CONTENT_WIDTH, detailCardHeight, 14).fill("#e2e8f0");
    doc.font(BRAND_FONTS.bodyBold).fontSize(9).fillColor(BRAND_COLORS.deepAqua);
    doc.text("Candidate details", CONTENT_LEFT + 16, detailCardTop + 16, { width: detailTextWidth });
    doc.font(BRAND_FONTS.body).fontSize(9).fillColor(BRAND_COLORS.charcoal);
    for (const line of detailLines) {
      doc.text(line, CONTENT_LEFT + 16, doc.y + 2, { width: detailTextWidth });
    }

    doc.y = detailCardTop + detailCardHeight + 24;
    doc
      .fontSize(8)
      .fillColor(BRAND_COLORS.muted)
      .font(BRAND_FONTS.body)
      .text(
        "This is a system-generated letter and does not require a physical signature. For queries, contact hello@careerzeta.com.",
        CONTENT_LEFT,
        doc.y,
        { align: "center", width: CONTENT_WIDTH },
      );

    doc.end();
  });
}
