"use client";

import { useLeadCapture } from "@/components/lead-capture/LeadCaptureProvider";

type BrochureButtonProps = {
  url: string;
  programName: string;
  /** "dark" (default) is dark text/border for light backgrounds; "light" is white text/border for dark backgrounds (e.g. a hero panel). */
  variant?: "dark" | "light";
};

export default function BrochureButton({ url, programName, variant = "dark" }: BrochureButtonProps) {
  const { requestBrochure } = useLeadCapture();

  return (
    <button
      type="button"
      onClick={() => requestBrochure(url, programName)}
      className={`rounded-full border-2 px-7 py-3.5 text-base font-bold transition-transform duration-150 hover:scale-105 ${
        variant === "light" ? "border-white text-white" : "border-[#111827] text-[#111827]"
      }`}
    >
      Download Brochure
    </button>
  );
}
