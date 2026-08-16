import { NextResponse } from "next/server";

/**
 * Newsletter signup integration point. No email/CRM provider is configured
 * yet, so this deliberately does not store or forward submissions — wire
 * the real provider in here (e.g. validate `body`, then call it) and
 * return 200 once it's live. Until then this must keep returning an error
 * rather than a fake success, per the content brief's rule against
 * claiming a submission was received when nothing is actually connected.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.mobile !== "string"
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  return NextResponse.json({ error: "not_configured" }, { status: 501 });
}
