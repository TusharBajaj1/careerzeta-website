import { sql } from "drizzle-orm";

import { db } from "@/lib/db";

/**
 * Gapless admission reference, backed by a Postgres sequence that's only
 * advanced the moment an admission letter is actually first sent — so
 * pending/cancelled/test enrollment rows (which share the same enrollments.id
 * sequence) never cause the first real admission to start at some
 * unrelated-looking number.
 */
export async function nextAdmissionNumber(): Promise<string> {
  const result = await db.execute<{ n: string }>(sql`SELECT nextval('admission_number_seq') AS n`);
  const n = Number(result.rows[0].n);
  return `ADM/${String(n).padStart(6, "0")}`;
}
