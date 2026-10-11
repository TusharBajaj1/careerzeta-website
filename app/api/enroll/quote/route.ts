import { NextResponse } from "next/server";

import { computeEnrollQuote } from "@/lib/enrollQuote";
import { isValidEmail, isValidMobile } from "@/lib/forms";

/**
 * Finds or creates the candidate's enrollment and shows them their fee
 * (and the registration-fee option, if one applies) before they pay.
 * This is where the enrollment row is actually created, so it's visible
 * in /admin/enrollments right away — even if the candidate never
 * completes payment.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { programSlug, name, email, phone, couponCode } = body;

  if (
    typeof programSlug !== "string" ||
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !isValidEmail(email) ||
    typeof phone !== "string" ||
    !isValidMobile(phone)
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const quote = await computeEnrollQuote({ programSlug, name, email, phone, couponCode });
  if (!quote.ok) {
    return NextResponse.json(quote, { status: 400 });
  }

  return NextResponse.json({
    enrollmentId: quote.enrollmentId,
    originalFeePaise: quote.originalFeePaise,
    discountPaise: quote.discountPaise,
    finalFeePaise: quote.finalFeePaise,
    registrationFeePaise: quote.registrationFeePaise,
  });
}
