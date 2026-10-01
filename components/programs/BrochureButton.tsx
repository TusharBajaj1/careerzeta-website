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
      className="rounded-lg border-2 border-gray-900 px-6 py-[13px] text-[15px] font-bold text-gray-900 transition-transform duration-150 hover:scale-105"
    >
      Download Brochure
    </button>
  );
}
