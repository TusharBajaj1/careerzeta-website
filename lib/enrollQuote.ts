import { validateCoupon } from "@/lib/coupons";
import { PROGRAMS } from "@/lib/content";
import { PROGRAM_DETAILS } from "@/lib/programsDetail";
import { parseFeeStringToRupees, rupeesToPaise } from "@/lib/money";

/** Registration-fee option is a fixed 10% of the (coupon-discounted) total fee. */
const REGISTRATION_FEE_PERCENT = 10;

export type EnrollQuote = {
  ok: true;
  program: (typeof PROGRAMS)[number];
  originalFeePaise: number;
  discountPaise: number;
  finalFeePaise: number;
  registrationFeePaise: number;
  couponId: number | null;
  salesExecutive: string | null;
};

export type EnrollQuoteError =
  | { ok: false; error: "invalid_program" }
  | { ok: false; error: "program_not_available_for_enrollment" }
  | { ok: false; error: "invalid_coupon"; reason: string };

/**
 * Shared by /api/enroll/quote (read-only, shows the candidate their
 * discounted fee before they commit) and /api/enroll (the real thing —
 * re-validates everything server-side rather than trusting the quote
 * the client already saw, since a coupon could expire/get used up in
 * between).
 */
export async function computeEnrollQuote(params: {
  programSlug: string;
  email: string;
  phone: string;
  couponCode?: string | null;
}): Promise<EnrollQuote | EnrollQuoteError> {
  const { programSlug, email, phone, couponCode } = params;

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

  let discountPaise = 0;
  let couponId: number | null = null;
  let salesExecutive: string | null = null;

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
    discountPaise = result.discountPaise;
    couponId = result.coupon.id;
    salesExecutive = result.coupon.createdBy;
  }

  const finalFeePaise = originalFeePaise - discountPaise;
  const registrationFeePaise = Math.round(finalFeePaise * (REGISTRATION_FEE_PERCENT / 100));

  return {
    ok: true,
    program,
    originalFeePaise,
    discountPaise,
    finalFeePaise,
    registrationFeePaise,
    couponId,
    salesExecutive,
  };
}
