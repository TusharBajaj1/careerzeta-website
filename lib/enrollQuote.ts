import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments } from "@/lib/db/schema";
import { validateCoupon } from "@/lib/coupons";
import { PROGRAMS } from "@/lib/content";
import { PROGRAM_DETAILS } from "@/lib/programsDetail";
import { parseFeeStringToRupees, rupeesToPaise } from "@/lib/money";

export type EnrollQuote = {
  ok: true;
  enrollmentId: number;
  program: (typeof PROGRAMS)[number];
  originalFeePaise: number;
  discountPaise: number;
  finalFeePaise: number;
  /** Null when there's no coupon/pre-registered deal offering one — the registration-fee option isn't offered in that case. */
  registrationFeePaise: number | null;
};

export type EnrollQuoteError =
  | { ok: false; error: "invalid_program" }
  | { ok: false; error: "program_not_available_for_enrollment" }
  | { ok: false; error: "invalid_coupon"; reason: string };

/**
 * Two-way enrollment lookup, called when a candidate reaches the "Pay Fee"
 * step:
 *  - If a sales exec already pre-registered this candidate for this program
 *    (an admin-created enrollment matching their email, still unpaid), that
 *    exact deal — total fee and registration-fee amount — is reused,
 *    so whatever the sales exec typed in /admin/enrollments is exactly
 *    what the candidate now sees.
 *  - A coupon the candidate types in always takes priority when present —
 *    it's (re-)validated and applied to that same enrollment, so going
 *    back and adding a coupon after an enrollment already exists still
 *    works, rather than being silently ignored.
 *  - If no enrollment exists yet, one is created right here (not only
 *    once they actually pay), so it shows up in /admin/enrollments
 *    immediately even if they never complete payment.
 */
export async function computeEnrollQuote(params: {
  programSlug: string;
  name: string;
  email: string;
  phone: string;
  couponCode?: string | null;
}): Promise<EnrollQuote | EnrollQuoteError> {
  const { programSlug, name, email, phone, couponCode } = params;

  const program = PROGRAMS.find((p) => p.slug === programSlug);
  const detail = PROGRAM_DETAILS.find((d) => d.slug === programSlug);
  if (!program || !detail) {
    return { ok: false, error: "invalid_program" };
  }

  const feeRupees = parseFeeStringToRupees(detail.fee);
  if (!feeRupees) {
    return { ok: false, error: "program_not_available_for_enrollment" };
  }
  const originalFeePaise = rupeesToPaise(feeRupees);

  const [existing] = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.candidateEmail, email.trim()),
        eq(enrollments.programSlug, programSlug),
        eq(enrollments.status, "pending"),
        eq(enrollments.amountPaid, 0),
      ),
    )
    .orderBy(desc(enrollments.createdAt))
    .limit(1);

  // A typed coupon always wins over whatever's already stored (including a
  // sales exec's pre-registered deal) — re-validated fresh each time.
  if (couponCode && couponCode.trim()) {
    const result = await validateCoupon({
      code: couponCode,
      candidateEmail: email,
      candidatePhone: phone,
      programSlug,
      originalFeePaise,
    });
    if (!result.valid) {
      return { ok: false, error: "invalid_coupon", reason: result.reason };
    }

    const finalFeePaise = originalFeePaise - result.discountPaise;
    const values = {
      couponId: result.coupon.id,
      salesExecutive: result.coupon.createdBy,
      totalFee: finalFeePaise,
      registrationFeeAmount: result.coupon.registrationFeeAmount,
    };

    const enrollmentId = existing
      ? (
          await db
            .update(enrollments)
            .set(values)
            .where(eq(enrollments.id, existing.id))
            .returning({ id: enrollments.id })
        )[0].id
      : (
          await db
            .insert(enrollments)
            .values({
              candidateName: name.trim(),
              candidateEmail: email.trim(),
              candidatePhone: phone.trim(),
              programSlug,
              status: "pending",
              ...values,
            })
            .returning({ id: enrollments.id })
        )[0].id;

    return {
      ok: true,
      enrollmentId,
      program,
      originalFeePaise,
      discountPaise: result.discountPaise,
      finalFeePaise,
      registrationFeePaise: result.coupon.registrationFeeAmount,
    };
  }

  if (existing) {
    return {
      ok: true,
      enrollmentId: existing.id,
      program,
      originalFeePaise,
      discountPaise: originalFeePaise - existing.totalFee,
      finalFeePaise: existing.totalFee,
      registrationFeePaise: existing.registrationFeeAmount,
    };
  }

  const [created] = await db
    .insert(enrollments)
    .values({
      candidateName: name.trim(),
      candidateEmail: email.trim(),
      candidatePhone: phone.trim(),
      programSlug,
      totalFee: originalFeePaise,
      status: "pending",
    })
    .returning();

  return {
    ok: true,
    enrollmentId: created.id,
    program,
    originalFeePaise,
    discountPaise: 0,
    finalFeePaise: originalFeePaise,
    registrationFeePaise: null,
  };
}
