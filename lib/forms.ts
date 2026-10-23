const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Indian mobile numbers: 10 digits, starting 6-9 — stricter than a bare length check to catch typos earlier. */
const MOBILE_RE = /^[6-9]\d{9}$/;

export function isValidMobile(value: string): boolean {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  return MOBILE_RE.test(digits);
}

/** Standard 15-character GSTIN format: 2-digit state code, 10-char PAN, entity code, "Z", checksum. */
const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export function isValidGstin(value: string): boolean {
  return GSTIN_RE.test(value.trim().toUpperCase());
}

/** Generic, still-graceful copy for when a form's backend isn't wired up yet. */
export const FORM_NOT_CONFIGURED_MESSAGE =
  "We couldn't complete your submission right now — please try again shortly, or email us directly at hello@careerzeta.com.";

export const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function validateCvFile(file: File): string | null {
  if (!ACCEPTED_CV_TYPES.includes(file.type)) {
    return "Please upload a PDF or Word document.";
  }
  if (file.size > MAX_CV_SIZE_BYTES) {
    return "That file is larger than 5MB — please upload a smaller file.";
  }
  return null;
}
