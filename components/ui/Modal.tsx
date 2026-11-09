"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  // Rendered via a portal straight onto <body> — not just inline where
  // the trigger button happens to live. A `fixed` element positions
  // relative to the nearest ancestor with a transform/filter/perspective
  // (e.g. the floating enroll pill's -translate-x-1/2, or a Framer Motion
  // animation mid-transform) instead of the viewport, which otherwise
  // squeezes this modal into that ancestor's small box instead of
  // covering the screen.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl border-2 border-line bg-white p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 rounded-full p-1.5 text-gray-500 transition hover:bg-slate-100 hover:text-gray-900"
        >
          <X className="h-5 w-5" />
        </button>

        {title && (
          <h2 className="pr-8 font-display text-2xl font-bold">{title}</h2>
        )}

        <div className={title ? "mt-5" : ""}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
