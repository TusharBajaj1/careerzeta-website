import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { enrollments } from "@/lib/db/schema";
import { sendRegistrationConfirmation } from "@/lib/registrationLetterEmail";

/**
 * Manually (re)sends the registration-confirmation letter — for an
 * enrollment that paid its registration fee before this feature existed,
 * or any other case where the automatic send (see confirmPaymentPaid)
 * didn't go out. Always generates fresh from the enrollment's current
 * data; there's no "already sent" state tracked for this letter the way
 * there is for the admission letter, so every call is just a (re)send.
 */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const enrollmentId = Number(id);
  if (!Number.isInteger(enrollmentId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);
  if (!enrollment) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (enrollment.status !== "registration_paid") {
    return NextResponse.json({ error: "not_registration_paid" }, { status: 400 });
  }

  const { sent } = await sendRegistrationConfirmation(enrollment);
  return NextResponse.json({ ok: true, sent });
}
