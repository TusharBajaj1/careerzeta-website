import { NextResponse } from "next/server";

import { computeEnrollQuote } from "@/lib/enrollQuote";
import { isValidEmail, isValidMobile } from "@/lib/forms";

/**
 * Read-only: shows the candidate their discounted fee (and the 10%
 * registration-fee option) before they commit to anything. No DB writes —
 * the real validation happens again in /api/enroll when they actually pay.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { programSlug, email, phone, couponCode } = body;

  if (
    typeof programSlug !== "string" ||
    typeof email !== "string" ||
    !isValidEmail(email) ||
    typeof phone !== "string" ||
    !isValidMobile(phone)
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const quote = await computeEnrollQuote({ programSlug, email, phone, couponCode });
  if (!quote.ok) {
    return NextResponse.json(quote, { status: 400 });
  }

  return NextResponse.json({
    originalFeePaise: quote.originalFeePaise,
    discountPaise: quote.discountPaise,
    finalFeePaise: quote.finalFeePaise,
    registrationFeePaise: quote.registrationFeePaise,
  });
}
