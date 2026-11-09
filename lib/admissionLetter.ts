import PDFDocument from "pdfkit";

import { COMPANY } from "@/lib/company";
import { paiseToRupees } from "@/lib/money";

export type AdmissionLetterData = {
  enrollmentId: number;
  admittedAt: Date;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  programName: string;
  totalFeePaise: number;
};

/** Matches lib/invoice.ts's reasoning — pdfkit's standard fonts don't cover the ₹ glyph. */
function formatInr(paise: number): string {
  return `Rs. ${paiseToRupees(paise).toLocaleString("en-IN")}`;
}

export function generateAdmissionLetterPdf(data: AdmissionLetterData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const refNumber = `ADM/${String(data.enrollmentId).padStart(6, "0")}`;

    // Letterhead
    doc.fontSize(18).font("Helvetica-Bold").fillColor("#111827").text(COMPANY.legalName);
    doc.fontSize(9).font("Helvetica").fillColor("#555555");
    for (const line of COMPANY.addressLines) doc.text(line);
    doc.moveDown(1.2);

    doc.fontSize(9).font("Helvetica").fillColor("#555555");
    doc.text(`Ref: ${refNumber}`);
    doc.text(
      `Date: ${data.admittedAt.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
    );
    doc.moveDown(1);

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("LETTER OF ADMISSION", { align: "center" });
    doc.moveDown(1.5);

    doc.fontSize(11).font("Helvetica").fillColor("#111827");
    doc.text(`Dear ${data.candidateName},`);
    doc.moveDown(0.8);

    doc.text(
      `Congratulations! We are pleased to confirm your admission to the ${data.programName} program at ${COMPANY.legalName}.`,
      { align: "justify" },
    );
    doc.moveDown(0.8);

    doc.text(
      `This letter confirms that your fee payment of ${formatInr(data.totalFeePaise)} for this program has been received in full, and your enrollment now stands fully confirmed.`,
      { align: "justify" },
    );
    doc.moveDown(0.8);

    doc.text(
      "Our team will reach out to you shortly with details of your batch schedule and onboarding. If you have any questions in the meantime, please write to us at hello@careerzeta.com.",
      { align: "justify" },
    );
    doc.moveDown(0.8);

    doc.text("We look forward to supporting you through your learning journey and wish you great success.", {
      align: "justify",
    });
    doc.moveDown(1.5);

    doc.text("Warm regards,");
    doc.moveDown(0.3);
    doc.font("Helvetica-Bold").text("Team CareerZeta");
    doc.font("Helvetica").text(COMPANY.legalName);
    doc.moveDown(1.5);

    doc.fontSize(9).fillColor("#555555");
    doc.text("Candidate Details", { underline: true });
    doc.text(`Name: ${data.candidateName}`);
    doc.text(`Email: ${data.candidateEmail}`);
    doc.text(`Phone: ${data.candidatePhone}`);
    doc.text(`Program: ${data.programName}`);
    doc.text(`Enrollment Ref: ${refNumber}`);

    doc.moveDown(2);
    doc
      .fontSize(8)
      .fillColor("#888888")
      .text(
        "This is a system-generated letter and does not require a physical signature. For queries, contact hello@careerzeta.com.",
        { align: "center" },
      );

    doc.end();
  });
}
