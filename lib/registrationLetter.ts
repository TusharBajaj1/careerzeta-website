import PDFDocument from "pdfkit";

import { COMPANY } from "@/lib/company";
import { formatPaiseAsInr } from "@/lib/money";
import { BRAND_COLORS, BRAND_FONTS, drawEyebrow, drawLetterhead, drawTintCard, registerBrandFonts } from "@/lib/pdfBrand";

/** Deliberately carries no admission number — this confirms a reserved seat on the registration fee alone, not an admission. The official Letter of Admission (lib/admissionLetter.ts) still only goes out, with its own gapless reference, once the balance is paid in full. */
export type RegistrationLetterData = {
  issuedAt: Date;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  programName: string;
  amountPaidPaise: number;
};

const CONTENT_LEFT = 50;
const CONTENT_RIGHT = 545;
const CONTENT_WIDTH = CONTENT_RIGHT - CONTENT_LEFT;

export function generateRegistrationConfirmationPdf(data: RegistrationLetterData): Promise<Buffer> {
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
      `Date: ${data.issuedAt.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
      CONTENT_LEFT,
    );
    doc.moveDown(1.2);

    drawEyebrow(doc, "Registration Confirmation", CONTENT_LEFT, doc.y);
    doc.moveDown(1);

    doc.font(BRAND_FONTS.heading).fontSize(19).fillColor(BRAND_COLORS.charcoal);
    doc.text("Your seat is reserved", CONTENT_LEFT);
    doc.moveDown(1);

    // Only the registration fee itself is shown here — the total program
    // fee and remaining balance vary per learner (discounts, coupons), so
    // this deliberately stays generic about them rather than printing a
    // number that could be compared across letters.
    {
      const cardX = CONTENT_LEFT;
      const cardTop = doc.y;
      const cardWidth = CONTENT_WIDTH;
      const textWidth = cardWidth - 32;
      const line = `Registration fee paid: ${formatPaiseAsInr(data.amountPaidPaise)}`;

      doc.font(BRAND_FONTS.bodyBold).fontSize(10);
      const titleHeight = doc.heightOfString("Fee summary", { width: textWidth });
      doc.font(BRAND_FONTS.body).fontSize(10);
      const bodyHeight = doc.heightOfString(line, { width: textWidth });
      const cardHeight = 16 + titleHeight + 6 + bodyHeight + 16;

      drawTintCard(doc, cardX, cardTop, cardWidth, cardHeight);

      doc.font(BRAND_FONTS.bodyBold).fontSize(10).fillColor(BRAND_COLORS.deepAqua);
      doc.text("Fee summary", cardX + 16, cardTop + 16, { width: textWidth });
      doc.font(BRAND_FONTS.body).fontSize(10).fillColor(BRAND_COLORS.charcoal);
      doc.text(line, cardX + 16, doc.y + 2, { width: textWidth });

      doc.y = cardTop + cardHeight + 18;
      doc.x = CONTENT_LEFT;
    }

    doc.font(BRAND_FONTS.body).fontSize(11).fillColor(BRAND_COLORS.charcoal);
    const bodyText = [
      `Dear ${data.candidateName},`,
      ``,
      `We've received your registration fee for ${data.programName}, and your seat is now reserved.`,
      ``,
      `Please pay the remaining fee at your earliest convenience — once that's done, we'll send your official Admission Letter confirming your enrollment.`,
      ``,
      `If you have any questions in the meantime, please write to us at hello@careerzeta.com.`,
    ].join("\n");
    const paragraphs = bodyText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
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

    const detailCardTop = doc.y;
    const detailLines = [
      `Name: ${data.candidateName}`,
      `Email: ${data.candidateEmail}`,
      `Phone: ${data.candidatePhone}`,
      `Program: ${data.programName}`,
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
