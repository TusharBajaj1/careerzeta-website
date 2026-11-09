import PDFDocument from "pdfkit";

import { COMPANY } from "@/lib/company";
import { paiseToRupees } from "@/lib/money";
import { BRAND_COLORS, BRAND_FONTS, drawEyebrow, drawLetterhead, registerBrandFonts } from "@/lib/pdfBrand";

export type AdmissionLetterData = {
  enrollmentId: number;
  admittedAt: Date;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  programName: string;
  totalFeePaise: number;
  batchDetails?: string | null;
};

/** Matches lib/invoice.ts's reasoning — pdfkit's standard fonts don't cover the ₹ glyph. */
function formatInr(paise: number): string {
  return `Rs. ${paiseToRupees(paise).toLocaleString("en-IN")}`;
}

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

    const refNumber = `ADM/${String(data.enrollmentId).padStart(6, "0")}`;

    const letterheadBottom = drawLetterhead(doc, {
      addressLines: COMPANY.addressLines,
      contentLeft: CONTENT_LEFT,
      contentRight: CONTENT_RIGHT,
    });
    doc.y = letterheadBottom;

    doc.font(BRAND_FONTS.body).fontSize(8.5).fillColor(BRAND_COLORS.muted);
    doc.text(
      `Ref: ${refNumber}  ·  Date: ${data.admittedAt.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
      CONTENT_LEFT,
    );
    doc.moveDown(1.2);

    drawEyebrow(doc, "Letter of Admission", CONTENT_LEFT, doc.y);
    doc.moveDown(1);

    doc.font(BRAND_FONTS.heading).fontSize(19).fillColor(BRAND_COLORS.charcoal);
    doc.text("Admission confirmed", CONTENT_LEFT);
    doc.moveDown(1);

    doc.font(BRAND_FONTS.body).fontSize(11).fillColor(BRAND_COLORS.charcoal);
    doc.text(`Dear ${data.candidateName},`, CONTENT_LEFT, doc.y, { width: CONTENT_WIDTH });
    doc.moveDown(0.8);

    doc.text(
      `We're pleased to confirm your admission to ${data.programName} at ${COMPANY.legalName}. Your fee payment of ${formatInr(data.totalFeePaise)} has been received in full, and your enrollment now stands fully confirmed.`,
      CONTENT_LEFT,
      doc.y,
      { width: CONTENT_WIDTH, align: "justify" },
    );
    doc.moveDown(1.2);

    // Batch details — the brand's rounded tint card, icon-less key line
    // since there's no icon library embedded in the PDF.
    if (data.batchDetails) {
      const cardX = CONTENT_LEFT;
      const cardTop = doc.y;
      const cardWidth = CONTENT_WIDTH;
      const textWidth = cardWidth - 32;

      doc.font(BRAND_FONTS.bodyBold).fontSize(10);
      const titleHeight = doc.heightOfString("Batch details", { width: textWidth });
      doc.font(BRAND_FONTS.body).fontSize(10);
      const bodyHeight = doc.heightOfString(data.batchDetails, { width: textWidth });
      const cardHeight = 16 + titleHeight + 6 + bodyHeight + 16;

      doc.roundedRect(cardX, cardTop, cardWidth, cardHeight, 14).fill(BRAND_COLORS.tintBlue);

      doc.font(BRAND_FONTS.bodyBold).fontSize(10).fillColor(BRAND_COLORS.deepAqua);
      doc.text("Batch details", cardX + 16, cardTop + 16, { width: textWidth });
      doc.font(BRAND_FONTS.body).fontSize(10).fillColor(BRAND_COLORS.charcoal);
      doc.text(data.batchDetails, cardX + 16, doc.y + 4, { width: textWidth });

      doc.y = cardTop + cardHeight + 18;
      doc.x = CONTENT_LEFT;
    } else {
      doc.font(BRAND_FONTS.body).fontSize(11).fillColor(BRAND_COLORS.charcoal);
      doc.text(
        "Our team will reach out to you shortly with details of your batch schedule and onboarding.",
        CONTENT_LEFT,
        doc.y,
        { width: CONTENT_WIDTH, align: "justify" },
      );
      doc.moveDown(1.2);
    }

    doc.font(BRAND_FONTS.body).fontSize(11).fillColor(BRAND_COLORS.charcoal);
    doc.text(
      "If you have any questions in the meantime, please write to us at hello@careerzeta.com. We look forward to supporting you through your learning journey and wish you great success.",
      CONTENT_LEFT,
      doc.y,
      { width: CONTENT_WIDTH, align: "justify" },
    );
    doc.moveDown(1.5);

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
      `Enrollment ref: ${refNumber}`,
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
