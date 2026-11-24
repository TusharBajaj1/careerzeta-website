/**
 * Edmingle SDK config — both values come from the whitelabeled LMS setup
 * (see Edmingle's "Website and App setup" dashboard), not from this repo,
 * so they're read from env vars rather than hardcoded. Every helper below
 * degrades to "not configured" (false/null) until both are set, so the
 * rest of the site works exactly as before until this is wired up.
 *
 * EDMINGLE_LMS_DOMAIN must be the whitelabeled custom domain (e.g.
 * "https://learn.careerzeta.com") — Edmingle's iframe SDK does not work
 * against the raw "*.edmingle.com" account URL, only a verified custom
 * domain (see the whitelisting KB article).
 */

const LMS_DOMAIN = process.env.NEXT_PUBLIC_EDMINGLE_LMS_DOMAIN?.replace(/\/$/, "");
const SUBDOMAIN = process.env.NEXT_PUBLIC_EDMINGLE_SUBDOMAIN;

export function isEdmingleConfigured(): boolean {
  return !!(LMS_DOMAIN && SUBDOMAIN);
}

export function edmingleLmsDomain(): string | null {
  return LMS_DOMAIN ?? null;
}

export function edmingleIframeSrc(): string | null {
  if (!LMS_DOMAIN || !SUBDOMAIN) return null;
  return `${LMS_DOMAIN}/js-sdks/signup-sdk/iframe.php?subdomain=${encodeURIComponent(SUBDOMAIN)}`;
}

export function edmingleSdkScriptSrc(): string | null {
  if (!LMS_DOMAIN) return null;
  return `${LMS_DOMAIN}/js-sdks/signup-sdk/signup-sdk.js?v=2.8`;
}
