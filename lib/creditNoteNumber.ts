import { sql } from "drizzle-orm";

import { db } from "@/lib/db";

/**
 * Gapless, GST-compliant credit note number — its own independent series
 * from invoice numbers (GST rules require credit notes to be uniquely
 * identifiable from tax invoices, not reuse the same numbering). Same
 * nextval()-at-generation-time reasoning as nextInvoiceNumber.
 */
export async function nextCreditNoteNumber(): Promise<string> {
  const result = await db.execute<{ n: string }>(sql`SELECT nextval('credit_note_number_seq') AS n`);
  const n = Number(result.rows[0].n);
  return `CZ/CN/${String(n).padStart(6, "0")}`;
}
