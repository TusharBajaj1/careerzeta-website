import { NextResponse } from "next/server";

/**
 * Mentor / career interest integration point. All submissions here should
 * eventually route to talent@careerzeta.com, with the email subject set by
 * `interest` — e.g. "Mentor Application — {name}", "Career Application —
 * {name}", or "Mentor + Career Application — {name}" for "both". No such
 * routing exists yet (no email/CRM provider configured, and CVs must not
 * be stored insecurely in the meantime), so this must keep returning an
 * error rather than a fake success until a real provider is wired in here.
 */
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);

  if (
    !form ||
    typeof form.get("interest") !== "string" ||
    typeof form.get("name") !== "string" ||
    typeof form.get("email") !== "string" ||
    typeof form.get("mobile") !== "string"
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  return NextResponse.json({ error: "not_configured" }, { status: 501 });
}
