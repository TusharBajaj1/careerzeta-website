import { createHmac, timingSafeEqual } from "crypto";

import Razorpay from "razorpay";

let client: Razorpay | null = null;

/** Returns null (rather than throwing) when the Razorpay keys aren't set in this environment yet. */
export function getRazorpayClient(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;

  if (!client) {
    client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return client;
}

/**
 * Verifies the `X-Razorpay-Signature` header against the raw webhook body,
 * constant-time. Must be checked against the *raw* body text — not a
 * re-stringified parse of it — since Razorpay signs the exact bytes sent.
 */
export function verifyRazorpayWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
}
