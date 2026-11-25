import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { creditNotes } from "@/lib/db/schema";

/** Streams the stored credit note PDF back with an attachment header. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paymentId = Number(id);
  if (!Number.isInteger(paymentId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const [creditNote] = await db.select().from(creditNotes).where(eq(creditNotes.paymentId, paymentId)).limit(1);
  if (!creditNote || !creditNote.pdfUrl) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const res = await fetch(creditNote.pdfUrl);
  if (!res.ok) {
    return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
  }
  const pdf = Buffer.from(await res.arrayBuffer());

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${creditNote.creditNoteNumber}.pdf"`,
    },
  });
}
