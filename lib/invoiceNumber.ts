import { sql } from "drizzle-orm";

import { db } from "@/lib/db";

/**
 * Gapless, GST-compliant invoice number (Rule 46, CGST Rules — unique,
 * consecutive, max 16 chars). Backed by a Postgres sequence that's only
 * advanced at the moment an invoice is actually about to be generated, so
 * abandoned/failed payment attempts never leave a gap in the sequence.
 */
export async function nextInvoiceNumber(): Promise<string> {
  const result = await db.execute<{ n: string }>(sql`SELECT nextval('invoice_number_seq') AS n`);
  const n = Number(result.rows[0].n);
  return `CZ/INV/${String(n).padStart(6, "0")}`;
}
