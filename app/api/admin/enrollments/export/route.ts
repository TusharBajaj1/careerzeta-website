import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { asc, desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { PROGRAMS } from "@/lib/content";
import { paiseToRupees } from "@/lib/money";

const STATUS_LABEL: Record<string, string> = {
  pending: "New (not registered)",
  registration_paid: "Registered (registration fee paid)",
  fully_paid: "Paid in full",
  refund_requested: "Asked for refund",
  cancelled: "Cancelled",
};

/** A spreadsheet download of every enrollment, for offline reporting/sharing — admin-only, gated by proxy.ts. */
export async function GET() {
  const enrollmentRows = await db.select().from(enrollments).orderBy(desc(enrollments.createdAt));
  const paymentRows = await db.select().from(payments).orderBy(asc(payments.createdAt));

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "CareerZeta";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Enrollments");
  sheet.columns = [
    { header: "ID", key: "id", width: 8 },
    { header: "Candidate Name", key: "name", width: 24 },
    { header: "Email", key: "email", width: 28 },
    { header: "Phone", key: "phone", width: 14 },
    { header: "State", key: "state", width: 18 },
    { header: "GSTIN", key: "gstin", width: 18 },
    { header: "Program", key: "program", width: 32 },
    { header: "Sales Executive", key: "salesExec", width: 18 },
    { header: "Total Fee (₹)", key: "totalFee", width: 14 },
    { header: "Registration Fee (₹)", key: "regFee", width: 18 },
    { header: "Amount Paid (₹)", key: "amountPaid", width: 16 },
    { header: "Balance (₹)", key: "balance", width: 14 },
    { header: "Status", key: "status", width: 28 },
    { header: "Payments Made", key: "paymentCount", width: 14 },
    { header: "Created At", key: "createdAt", width: 20 },
  ];
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF111827" } };
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

  for (const enrollment of enrollmentRows) {
    const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;
    const paymentCount = paymentRows.filter((p) => p.enrollmentId === enrollment.id && p.status === "paid").length;

    sheet.addRow({
      id: enrollment.id,
      name: enrollment.candidateName,
      email: enrollment.candidateEmail,
      phone: enrollment.candidatePhone,
      state: enrollment.candidateState ?? "",
      gstin: enrollment.candidateGstin ?? "",
      program: programName,
      salesExec: enrollment.salesExecutive ?? "",
      totalFee: paiseToRupees(enrollment.totalFee),
      regFee: enrollment.registrationFeeAmount !== null ? paiseToRupees(enrollment.registrationFeeAmount) : "",
      amountPaid: paiseToRupees(enrollment.amountPaid),
      balance: paiseToRupees(enrollment.totalFee - enrollment.amountPaid),
      status: STATUS_LABEL[enrollment.status] ?? enrollment.status,
      paymentCount,
      createdAt: enrollment.createdAt.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }),
    });
  }

  sheet.autoFilter = { from: "A1", to: "O1" };
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `careerzeta-enrollments-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
