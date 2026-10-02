import { NextResponse } from "next/server";

import { CONTACT } from "@/lib/content";
import { sendMail } from "@/lib/mailer";

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

  const { name, email, mobile } = body;

  const sent = await sendMail({
    to: CONTACT.email,
    subject: `New Newsletter Subscriber — ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}`,
    replyTo: email,
  });

  if (!sent) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  return NextResponse.json({ ok: true });
}
