"use client";

import { useLeadCapture } from "@/components/lead-capture/LeadCaptureProvider";

type BrochureButtonProps = {
  url: string;
  programName: string;
  /** "dark" (default) is dark text/border for light backgrounds; "light" is white text/border for dark backgrounds (e.g. a hero panel). Ignored if `className` is given. */
  variant?: "dark" | "light";
  /** Full class override for a layout that needs its own sizing/pill treatment — replaces the default classes entirely instead of merging. */
  className?: string;
  /** Defaults to "Download Brochure". */
  label?: string;
};

export default function BrochureButton({ url, programName, variant = "dark", className, label = "Download Brochure" }: BrochureButtonProps) {
  const { requestBrochure } = useLeadCapture();

  return (
    <button
      type="button"
      onClick={() => requestBrochure(url, programName)}
      className={
        className ??
        `rounded-full border-2 px-7 py-3.5 text-base font-bold transition-transform duration-150 hover:scale-105 ${
          variant === "light" ? "border-white text-white" : "border-[#111827] text-[#111827]"
        }`
      }
    >
      {label}
    </button>
  );
}
