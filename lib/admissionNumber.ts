import { eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments, type Enrollment } from "@/lib/db/schema";

/**
 * Gapless admission reference, backed by a Postgres sequence — so
 * pending/cancelled/test enrollment rows (which share the same
 * enrollments.id sequence) never cause the first real admission to
 * start at some unrelated-looking number.
 */
async function nextAdmissionNumber(): Promise<string> {
  const result = await db.execute<{ n: string }>(sql`SELECT nextval('admission_number_seq') AS n`);
  const n = Number(result.rows[0].n);
  return `ADM/${String(n).padStart(6, "0")}`;
}

/**
 * Assigns and persists an enrollment's admission reference the moment
 * admission actually happens (full payment) — not deferred to whenever
 * the letter happens to be sent or downloaded, since being admitted is
 * the real, already-irreversible event. Idempotent: an enrollment that
 * already has one just gets that one back, so calling this from several
 * places (the automatic trigger, a manual send, a download/preview) is
 * always safe. Also backfills an enrollment that reached fully_paid
 * before this existed — correct, since it genuinely was already admitted.
 */
export async function ensureAdmissionNumber(enrollment: Enrollment): Promise<string> {
  if (enrollment.admissionNumber) return enrollment.admissionNumber;

  const admissionNumber = await nextAdmissionNumber();
  await db.update(enrollments).set({ admissionNumber }).where(eq(enrollments.id, enrollment.id));
  return admissionNumber;
}
