import PDFDocument from "pdfkit";

import { COMPANY } from "@/lib/company";
import type { Enrollment, Payment } from "@/lib/db/schema";
import { PROGRAMS } from "@/lib/content";
import { paiseToRupees } from "@/lib/money";

function formatInr(paise: number): string {
  return `Rs. ${paiseToRupees(paise).toLocaleString("en-IN")}`;
}

const PAYMENT_TYPE_LABEL: Record<Payment["type"], string> = {
  full: "Course Fee",
  registration: "Registration Fee",
  balance: "Balance Payment",
};

/**
 * A 60-days-post-enrollment accounting record — NOT a second GST tax
 * invoice for money already invoiced at the time each payment was
 * received (that would double-count the same taxable supply). This just
 * restates, as a dated statement, every invoice already issued for this
 * enrollment plus the running total — a paper-trail safety net for
 * candidates who paid partially and then went quiet, so accounting
 * always has a day-60 record on file regardless of outcome.
 */
export function generateStatementPdf(enrollment: Enrollment, payments: Payment[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;
    const paidPayments = payments.filter((p) => p.status === "paid");
    const remaining = enrollment.totalFee - enrollment.amountPaid;

    doc.fontSize(18).font("Helvetica-Bold").fillColor("#111827").text(COMPANY.legalName);
    doc.fontSize(9).font("Helvetica").fillColor("#555555");
    for (const line of COMPANY.addressLines) doc.text(line);
    doc.text(`GSTIN: ${COMPANY.gstin}`);
    doc.moveDown(1);

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("STATEMENT OF ACCOUNT", { align: "center" });
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#888888")
      .text("60 days post enrollment — accounting record, not a tax invoice", { align: "center" });
    doc.moveDown(0.8);

    const colLeftX = doc.x;
    const colRightX = 320;
    const metaTop = doc.y;

    doc.fontSize(9).font("Helvetica-Bold").fillColor("#111827").text("Enrollment", colLeftX, metaTop);
    doc.font("Helvetica");
    doc.text(
      `Enrolled: ${enrollment.createdAt.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
      colLeftX,
    );
    doc.text(`Program: ${programName}`, colLeftX, undefined, { width: colRightX - colLeftX - 10 });
    doc.text(`Enrollment ID: ${enrollment.id}`, colLeftX);

    doc.fontSize(9).font("Helvetica-Bold").text("Candidate", colRightX, metaTop);
    doc.font("Helvetica");
    doc.text(enrollment.candidateName, colRightX);
    doc.text(enrollment.candidateEmail, colRightX);
    doc.text(enrollment.candidatePhone, colRightX);

    doc.x = colLeftX;
    doc.moveDown(1.5);

    const tableTop = doc.y;
    const col = { num: 50, date: 150, type: 240, amount: 420 };
    const tableRight = 545;

    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Invoice #", col.num, tableTop, { width: col.date - col.num - 5 });
    doc.text("Date", col.date, tableTop, { width: col.type - col.date - 5 });
    doc.text("Type", col.type, tableTop, { width: col.amount - col.type - 5 });
    doc.text("Amount", col.amount, tableTop, { width: tableRight - col.amount });

    doc
      .moveTo(col.num, tableTop + 14)
      .lineTo(tableRight, tableTop + 14)
      .strokeColor("#cccccc")
      .stroke();

    let y = tableTop + 20;
    doc.font("Helvetica");
    if (paidPayments.length === 0) {
      doc.text("No payments recorded yet.", col.num, y);
      y += 16;
    }
    for (const p of paidPayments) {
      doc.text(p.invoiceNumber ?? "—", col.num, y, { width: col.date - col.num - 5 });
      doc.text(
        p.paidAt ? p.paidAt.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "—",
        col.date,
        y,
        { width: col.type - col.date - 5 },
      );
      doc.text(PAYMENT_TYPE_LABEL[p.type], col.type, y, { width: col.amount - col.type - 5 });
      doc.text(formatInr(p.amount), col.amount, y, { width: tableRight - col.amount });
      y += 16;
    }

    doc
      .moveTo(col.num, y)
      .lineTo(tableRight, y)
      .strokeColor("#cccccc")
      .stroke();
    y += 10;

    doc.fontSize(9);
    doc.text(`Total Program Fee: ${formatInr(enrollment.totalFee)}`, col.num, y);
    y += 14;
    doc.font("Helvetica-Bold").text(`Total Paid to Date: ${formatInr(enrollment.amountPaid)}`, col.num, y);
    doc.font("Helvetica");
    y += 14;
    if (remaining > 0) {
      doc.text(`Balance Remaining: ${formatInr(remaining)}`, col.num, y);
    } else {
      doc.font("Helvetica-Bold").fillColor("#0a7a0a").text("Status: Paid in Full", col.num, y);
      doc.fillColor("#111827");
    }

    doc.moveDown(3);
    doc
      .fontSize(8)
      .fillColor("#888888")
      .font("Helvetica")
      .text(
        "Each payment above was already issued its own GST tax invoice at the time it was received; this statement is a consolidated record for accounting purposes and does not itself carry GST.",
        50,
        doc.y,
        { align: "center", width: tableRight - 50 },
      );

    doc.end();
  });
}
