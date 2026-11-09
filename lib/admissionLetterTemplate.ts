import { COMPANY } from "@/lib/company";
import { formatPaiseAsInr } from "@/lib/money";

/**
 * The starting text for a candidate's admission letter — fully editable
 * per enrollment (enrollments.admissionLetterBody) rather than fixed in
 * code, since the wording is expected to change as the business does.
 * This is the fallback used whenever no custom text has been saved yet,
 * and the pre-fill shown when an admin opens the editor for the first
 * time. No pdfkit/Node dependency here so it's safe to import from a
 * client component (the editor) as well as server code (the PDF
 * generator's caller).
 */
export function defaultAdmissionLetterBody(data: {
  candidateName: string;
  programName: string;
  totalFeePaise: number;
}): string {
  return [
    `Dear ${data.candidateName},`,
    ``,
    `We're pleased to confirm your admission to ${data.programName} at ${COMPANY.legalName}. Your fee payment of ${formatPaiseAsInr(data.totalFeePaise)} has been received in full, and your enrollment now stands fully confirmed.`,
    ``,
    `If you have any questions in the meantime, please write to us at hello@careerzeta.com. We look forward to supporting you through your learning journey and wish you great success.`,
  ].join("\n");
}
