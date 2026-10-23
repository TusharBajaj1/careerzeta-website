import { NextResponse } from "next/server";

import { CONTACT, PROGRAMS } from "@/lib/content";
import { db } from "@/lib/db";
import { demoRequests } from "@/lib/db/schema";
import { isValidEmail, isValidMobile } from "@/lib/forms";
import { sendMail } from "@/lib/mailer";

/**
 * Lighter-weight alternative to paying upfront — a candidate not ready to
 * pay can ask for a demo instead. Stored for the sales team to follow up
 * on (see /admin/demo-requests) and also emailed immediately so nothing
 * waits on someone checking the dashboard.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { programSlug, name, email, phone } = body;

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

  const program = PROGRAMS.find((p) => p.slug === programSlug);
  if (!program) {
    return NextResponse.json({ error: "invalid_program" }, { status: 400 });
  }

  await db.insert(demoRequests).values({
    candidateName: name.trim(),
    candidateEmail: email.trim(),
    candidatePhone: phone.trim(),
    programSlug,
  });

  await sendMail({
    to: CONTACT.email,
    subject: `New demo request — ${name} (${program.name})`,
    text: `Name: ${name}\nEmail: ${email}\nMobile: ${phone}\nProgram: ${program.name}\n\nFollow up to schedule their demo.`,
    replyTo: email,
  });

  return NextResponse.json({ ok: true });
}
