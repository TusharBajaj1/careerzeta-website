import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/** Used for both a post's cover image and images inserted into the rich-text body. */
export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "unsupported_type" }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  }

  const extension = file.name.split(".").pop() ?? "jpg";

  try {
    const blob = await put(`blog/${Date.now()}-${crypto.randomUUID()}.${extension}`, file, {
      access: "public",
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Blog image upload failed:", err);
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}
