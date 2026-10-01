import { NextResponse } from "next/server";

import { CONTACT } from "@/lib/content";
import { sendMail } from "@/lib/mailer";

/**
 * Temporary diagnostic — visit /api/contact in a browser to check whether
 * this deployment actually has the Gmail env vars set, without needing
 * Vercel's log viewer. Booleans only, never the actual values. Remove once
 * the enquiry form is confirmed working end to end.
 */
export async function GET() {
  return NextResponse.json({
    gmailUserSet: !!process.env.GMAIL_USER,
    gmailAppPasswordSet: !!process.env.GMAIL_APP_PASSWORD,
  });
}

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

  const { name, email, mobile, interest, message } = body;

  const sent = await sendMail({
    to: CONTACT.email,
    subject: `New Enquiry — ${name} (${interest})`,
    text: `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\nInterested in: ${interest}\n\nMessage:\n${message}`,
    replyTo: email,
  });

  if (!sent) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  return NextResponse.json({ ok: true });
}
