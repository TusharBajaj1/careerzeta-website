"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import EnquiryForm from "@/components/contact/EnquiryForm";
import Modal from "@/components/ui/Modal";

const CAPTURED_KEY = "cz_lead_captured";
const DISMISSED_KEY = "cz_popup_dismissed";
const ENTRY_POPUP_DELAY_MS = 4000;

const DEFAULT_TITLE = "Let's get you started";
const DEFAULT_INTRO =
  "Tell us a bit about yourself and we'll point you to the right program.";

type LeadCaptureContextValue = {
  /** Opens the enquiry form gate before handing off to the brochure URL; skips straight to the download once a lead has already been captured. */
  requestBrochure: (url: string, programName: string) => void;
};

const LeadCaptureContext = createContext<LeadCaptureContextValue | null>(null);

export function useLeadCapture(): LeadCaptureContextValue {
  const ctx = useContext(LeadCaptureContext);
  if (!ctx) {
    throw new Error("useLeadCapture must be used within LeadCaptureProvider");
  }
  return ctx;
}

export default function LeadCaptureProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState(DEFAULT_TITLE);
  const [modalIntro, setModalIntro] = useState(DEFAULT_INTRO);
  const [defaultInterest, setDefaultInterest] = useState<string | undefined>();

  /** Lead has actually submitted the form — skips the gate and the pop-up forever. */
  const hasCapturedRef = useRef(false);
  /** Closed the pop-up without submitting — stops the unprompted timer pop-up, but never excuses the brochure gate. */
  const dismissedRef = useRef(false);
  const isOpenRef = useRef(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const openModal = useCallback(
    (options?: {
      interest?: string;
      pendingAction?: () => void;
      title?: string;
      intro?: string;
    }) => {
      pendingActionRef.current = options?.pendingAction ?? null;
      setDefaultInterest(options?.interest);
      setModalTitle(options?.title ?? DEFAULT_TITLE);
      setModalIntro(options?.intro ?? DEFAULT_INTRO);
      isOpenRef.current = true;
      setIsOpen(true);
    },
    [],
  );

  const closeModal = useCallback(() => {
    isOpenRef.current = false;
    setIsOpen(false);
  }, []);

  const handleUserDismiss = useCallback(() => {
    if (!hasCapturedRef.current) {
      try {
        localStorage.setItem(DISMISSED_KEY, "1");
      } catch {
        // Private browsing or blocked storage — the flag just won't persist.
      }
      dismissedRef.current = true;
    }
    closeModal();
  }, [closeModal]);

  useEffect(() => {
    try {
      hasCapturedRef.current = localStorage.getItem(CAPTURED_KEY) === "1";
      dismissedRef.current = localStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
      // Private browsing or blocked storage — treat as not yet seen.
    }

    if (hasCapturedRef.current || dismissedRef.current) return;

    const timer = setTimeout(() => {
      if (!hasCapturedRef.current && !dismissedRef.current && !isOpenRef.current) {
        openModal();
      }
    }, ENTRY_POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, [openModal]);

  const requestBrochure = useCallback(
    (url: string, programName: string) => {
      if (hasCapturedRef.current) {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
      openModal({
        interest: programName,
        pendingAction: () => window.open(url, "_blank", "noopener,noreferrer"),
        title: `Get the ${programName} brochure`,
        intro: "Just a few details and the brochure is yours.",
      });
    },
    [openModal],
  );

  function handleFormSuccess() {
    try {
      localStorage.setItem(CAPTURED_KEY, "1");
    } catch {
      // Private browsing or blocked storage — the flag just won't persist.
    }
    hasCapturedRef.current = true;

    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    action?.();

    setTimeout(closeModal, 1500);
  }

  return (
    <LeadCaptureContext.Provider value={{ requestBrochure }}>
      {children}

      <Modal open={isOpen} onClose={handleUserDismiss} title={modalTitle}>
        <p className="mb-5 text-sm leading-relaxed opacity-75">{modalIntro}</p>
        <EnquiryForm
          defaultInterest={defaultInterest}
          onSuccess={handleFormSuccess}
        />
      </Modal>
    </LeadCaptureContext.Provider>
  );
}
