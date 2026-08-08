const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isValidMobile(value: string): boolean {
  return value.replace(/\D/g, "").length >= 8;
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
