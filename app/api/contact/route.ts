import { NextResponse } from "next/server";

/**
 * General enquiry integration point. No email/CRM provider is configured
 * yet, so this must keep returning an error rather than a fake success —
 * wire the real notification (e.g. email to hello@careerzeta.com) in here
 * and return 200 once it's live.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.mobile !== "string" ||
    typeof body.interest !== "string" ||
    typeof body.message !== "string"
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  return NextResponse.json({ error: "not_configured" }, { status: 501 });
}
