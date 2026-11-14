import { createHash, timingSafeEqual } from "crypto";

/**
 * Easebuzz's hash scheme (shared across their PHP/Java/Flutter SDKs) is a
 * plain SHA-512 digest of pipe-joined fields with the salt folded in — not
 * an HMAC. A field that's absent still occupies its slot as an empty
 * string, so the pipe count is fixed regardless of which udf1..udf10 are
 * actually used.
 */
const UDF_COUNT = 10;

type EasebuzzConfig = { key: string; salt: string; baseUrl: string };

/** Returns null (rather than throwing) when the Easebuzz keys aren't set in this environment yet. */
function getConfig(): EasebuzzConfig | null {
  const key = process.env.EASEBUZZ_MERCHANT_KEY;
  const salt = process.env.EASEBUZZ_SALT;
  if (!key || !salt) return null;

  const env = (process.env.EASEBUZZ_ENV ?? "test").toLowerCase();
  const baseUrl =
    env === "prod" || env === "production" || env === "live"
      ? "https://pay.easebuzz.in"
      : "https://testpay.easebuzz.in";

  return { key, salt, baseUrl };
}

export function isEasebuzzConfigured(): boolean {
  return getConfig() !== null;
}

export type EasebuzzLinkParams = {
  /** Our own id for this transaction — Easebuzz doesn't mint one, so this is what we match the webhook back on. Alphanumeric only. */
  txnid: string;
  amountPaise: number;
  productInfo: string;
  firstName: string;
  email: string;
  phone: string;
  successUrl: string;
  failureUrl: string;
  /** Surfaced on the Easebuzz dashboard for manual reconciliation — not used by our own webhook matching. */
  udf1?: string;
  udf2?: string;
};

/**
 * Creates a hosted Easebuzz payment page and returns its URL, the same
 * shape as Razorpay's paymentLink.create — one link to send the candidate,
 * who can complete it whenever.
 *
 * Endpoint, request fields, hash sequence, and response shape are all
 * confirmed directly against docs.easebuzz.in's "Initiate Payment API"
 * reference page (its Pay by Link flow — generate a link once, candidate
 * pays whenever). The webhook's reverse-hash field order (below) is
 * confirmed against Easebuzz's own official NodeJS integration kit
 * (github.com/easebuzz/paywitheasebuzz-nodejs-lib, easebuzz-lib/utils.js
 * _getReverseHashKey) — byte-for-byte the same sequence implemented here.
 */
export async function createEasebuzzPaymentLink(
  params: EasebuzzLinkParams,
): Promise<{ paymentLinkUrl: string; txnid: string }> {
  const config = getConfig();
  if (!config) throw new Error("easebuzz_not_configured");

  const amount = (params.amountPaise / 100).toFixed(2);
  const udfs = [params.udf1 ?? "", params.udf2 ?? "", "", "", "", "", "", "", "", ""];

  const hash = createHash("sha512")
    .update(
      [config.key, params.txnid, amount, params.productInfo, params.firstName, params.email, ...udfs, config.salt].join(
        "|",
      ),
    )
    .digest("hex");

  const body = new URLSearchParams({
    key: config.key,
    txnid: params.txnid,
    amount,
    productinfo: params.productInfo,
    firstname: params.firstName,
    email: params.email,
    phone: params.phone,
    surl: params.successUrl,
    furl: params.failureUrl,
    hash,
  });
  udfs.forEach((v, i) => body.set(`udf${i + 1}`, v));

  const res = await fetch(`${config.baseUrl}/payment/initiateLink`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json().catch(() => null);
  const accessKey = data?.data;
  if (!res.ok || !data || data.status !== 1 || typeof accessKey !== "string") {
    throw new Error(`easebuzz_initiate_failed: ${JSON.stringify(data) ?? res.status}`);
  }

  return { paymentLinkUrl: `${config.baseUrl}/pay/${accessKey}`, txnid: params.txnid };
}

/**
 * Verifies a webhook/callback's reverse hash against the posted fields:
 * salt|status|udf10..udf1|email|firstname|productinfo|amount|txnid|key,
 * matching Easebuzz's official NodeJS kit's _getReverseHashKey exactly
 * (same sequence their Transaction Webhook and surl/furl callback both
 * use). Pass the raw posted fields (form-decoded, not JSON — Easebuzz
 * posts these as a form body) straight through; don't re-derive or
 * reformat any of them first.
 */
export function verifyEasebuzzWebhookSignature(fields: Record<string, string>): boolean {
  const config = getConfig();
  if (!config) return false;

  const receivedHash = fields.hash ?? "";
  if (!receivedHash) return false;

  const udfsDescending = Array.from({ length: UDF_COUNT }, (_, i) => fields[`udf${UDF_COUNT - i}`] ?? "");

  const expected = createHash("sha512")
    .update(
      [
        config.salt,
        fields.status ?? "",
        ...udfsDescending,
        fields.email ?? "",
        fields.firstname ?? "",
        fields.productinfo ?? "",
        fields.amount ?? "",
        fields.txnid ?? "",
        config.key,
      ].join("|"),
    )
    .digest("hex");

  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(receivedHash);
  return expectedBuf.length === receivedBuf.length && timingSafeEqual(expectedBuf, receivedBuf);
}

/** A fresh, alphanumeric-only transaction id — Easebuzz's SDKs validate txnid against a strict pattern, so no hyphens/underscores. */
export function generateEasebuzzTxnId(paymentId: number): string {
  return `CZ${paymentId}${Date.now()}`;
}

/** Easebuzz's productinfo field only allows letters, digits, hyphen, whitespace and pipe, max 45 chars (confirmed against docs.easebuzz.in's Initiate Payment API reference) — our normal description strings use em dashes and run well past that, so this strips/truncates rather than letting the API reject the call. */
export function sanitizeEasebuzzProductInfo(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9\s|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 45);
}

/** Easebuzz's phone field pattern (^(\+\d{1,4}[-]?)?\d{5,20}$) has no room for spaces — our stored candidatePhone may have them (however the candidate typed it), so strip everything but digits/+/-. */
export function sanitizeEasebuzzPhone(phone: string): string {
  return phone.replace(/[^\d+-]/g, "");
}
