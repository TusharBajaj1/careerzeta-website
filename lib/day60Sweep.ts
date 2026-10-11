import { and, eq, gte, lt } from "drizzle-orm";

import { CONTACT, PROGRAMS } from "@/lib/content";
import { db } from "@/lib/db";
import { enrollments, payments } from "@/lib/db/schema";
import { generateStatementPdf } from "@/lib/statementInvoice";
import { sendMail } from "@/lib/mailer";
import { formatPaiseAsInr } from "@/lib/money";

const DAY_60_MS = 60 * 24 * 60 * 60 * 1000;

/**
 * Finds every enrollment that took its first payment at least 60 days ago
 * and hasn't had its day-60 statement sent yet, then sends one — to the
 * candidate and to CONTACT.email — regardless of current status (pending,
 * partially paid, fully paid, or cancelled/dropped). This is the paper-trail
 * safety net for a candidate who paid partially and then went quiet: by
 * day 60 accounting has a dated record of exactly what was collected,
 * even if nothing further is ever paid.
 *
 * Scoped to enrollments with at least one payment — nothing to state for
 * an enrollment nobody ever paid toward.
 */
export async function runDay60InvoiceSweep(): Promise<{ processed: number; sent: number; failed: number }> {
  const cutoff = new Date(Date.now() - DAY_60_MS);

  const due = await db
    .select()
    .from(enrollments)
    .where(and(gte(enrollments.amountPaid, 1), lt(enrollments.createdAt, cutoff), eq(enrollments.day60InvoiceSent, false)));

  let sent = 0;
  let failed = 0;

  for (const enrollment of due) {
    try {
      const enrollmentPayments = await db.select().from(payments).where(eq(payments.enrollmentId, enrollment.id));
      const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;
      const pdf = await generateStatementPdf(enrollment, enrollmentPayments);
      const attachments = [
        { filename: `Statement-${enrollment.id}.pdf`, content: pdf, contentType: "application/pdf" },
      ];
      const remaining = enrollment.totalFee - enrollment.amountPaid;

      await sendMail({
        to: enrollment.candidateEmail,
        subject: `Statement of Account — ${programName}`,
        text: [
          `Hi ${enrollment.candidateName},`,
          ``,
          `It's been 60 days since you enrolled in ${programName}. Attached is a statement of your account to date.`,
          `Total paid: ${formatPaiseAsInr(enrollment.amountPaid)} of ${formatPaiseAsInr(enrollment.totalFee)}.`,
          remaining > 0 ? `Balance remaining: ${formatPaiseAsInr(remaining)}.` : `Your course fee is paid in full.`,
          ``,
          `Questions? Reach us at ${CONTACT.email}.`,
          ``,
          `— Team CareerZeta`,
        ].join("\n"),
        attachments,
      });

      await sendMail({
        to: CONTACT.email,
        subject: `[Accounting] 60-day statement — ${enrollment.candidateName}`,
        text: [
          `60-day statement generated for ${enrollment.candidateName} (${enrollment.candidateEmail}, ${enrollment.candidatePhone}).`,
          `Program: ${programName}`,
          `Status: ${enrollment.status}`,
          `Total paid to date: ${formatPaiseAsInr(enrollment.amountPaid)} of ${formatPaiseAsInr(enrollment.totalFee)}`,
          `Enrollment ID: ${enrollment.id}`,
        ].join("\n"),
        attachments,
      });

      await db.update(enrollments).set({ day60InvoiceSent: true }).where(eq(enrollments.id, enrollment.id));
      sent++;
    } catch (err) {
      console.error(`Day-60 statement failed for enrollment ${enrollment.id}:`, err);
      failed++;
    }
  }

  return { processed: due.length, sent, failed };
}
