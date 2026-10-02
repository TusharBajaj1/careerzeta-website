"use client";

import { useLeadCapture } from "@/components/lead-capture/LeadCaptureProvider";

type BrochureButtonProps = {
  url: string;
  programName: string;
};

export default function BrochureButton({ url, programName }: BrochureButtonProps) {
  const { requestBrochure } = useLeadCapture();

  return (
    <button
      type="button"
      onClick={() => requestBrochure(url, programName)}
      className="rounded-full border-2 border-[#111827] px-7 py-3.5 text-base font-bold text-[#111827] transition-transform duration-150 hover:scale-105"
    >
      Download Brochure
    </button>
  );
}
