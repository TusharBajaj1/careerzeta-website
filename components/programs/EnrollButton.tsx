"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import { INDIAN_STATE_NAMES } from "@/lib/indianStates";
import { formatPaiseAsInr } from "@/lib/money";

type EnrollButtonProps = {
  programSlug: string;
  programName: string;
};

type Quote = {
  enrollmentId: number;
  originalFeePaise: number;
  discountPaise: number;
  finalFeePaise: number;
  registrationFeePaise: number | null;
};

type ApiError = { error?: string; reason?: string };

function errorMessage(data: ApiError): string {
  if (data.error === "invalid_coupon") return data.reason ?? "That coupon isn't valid.";
  if (data.error === "not_configured") {
    return "Payments aren't set up yet — please contact us directly to enroll.";
  }
  return "Something went wrong — please try again, or contact us directly.";
}

type Step = "choice" | "payDetails" | "pay" | "demoDetails" | "demoSuccess";

export default function EnrollButton({ programSlug, programName }: EnrollButtonProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("choice");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [paymentType, setPaymentType] = useState<"full" | "registration">("full");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setStep("choice");
    setName("");
    setEmail("");
    setPhone("");
    setState("");
    setQuote(null);
    setPaymentType("full");
    setError(null);
    setSubmitting(false);
  }

  async function handleQuote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/enroll/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programSlug, name, email, phone, state }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(errorMessage(data));
        setSubmitting(false);
        return;
      }

      setQuote(data);
      setPaymentType("full");
      setStep("pay");
      setSubmitting(false);
    } catch {
      setError("Something went wrong — please try again, or contact us directly.");
      setSubmitting(false);
    }
  }

  async function handlePay() {
    if (!quote) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId: quote.enrollmentId, paymentType, email, phone }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(errorMessage(data));
        setSubmitting(false);
        return;
      }

      window.location.href = data.paymentLinkUrl;
    } catch {
      setError("Something went wrong — please try again, or contact us directly.");
      setSubmitting(false);
    }
  }

  async function handleDemoRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programSlug, name, email, phone }),
      });

      if (!res.ok) {
        setError("Something went wrong — please try again, or contact us directly.");
        setSubmitting(false);
        return;
      }

      setStep("demoSuccess");
      setSubmitting(false);
    } catch {
      setError("Something went wrong — please try again, or contact us directly.");
      setSubmitting(false);
    }
  }

  const title =
    step === "demoSuccess" ? `Request received — ${programName}` : `Enroll — ${programName}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-sky-400 px-[30px] py-4 text-base font-bold text-[#111827] transition-transform duration-150 hover:scale-105"
      >
        Enroll Now
      </button>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          reset();
        }}
        title={title}
      >
        {step === "choice" && (
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setStep("payDetails")}
              className="w-full rounded-lg bg-sky-400 px-7 py-4 text-base font-bold text-slate-900 transition-transform duration-150 hover:scale-105"
            >
              Pay Fee
            </button>
            <p className="text-center text-xs opacity-60">
              Pay in full or pay a registration fee to get started
            </p>
            <button
              type="button"
              onClick={() => setStep("demoDetails")}
              className="w-full rounded-lg border-2 border-line px-7 py-3.5 text-sm font-bold transition hover:border-sky-400"
            >
              Register for a Demo
            </button>
          </div>
        )}

        {step === "payDetails" && (
          <form onSubmit={handleQuote} className="flex flex-col gap-4">
            <input
              name="name"
              type="text"
              aria-label="Full name"
              placeholder="Full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
            <input
              name="email"
              type="email"
              aria-label="Email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
            <input
              name="phone"
              type="tel"
              aria-label="Mobile number"
              placeholder="Mobile number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
            <select
              name="state"
              aria-label="State"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
            >
              <option value="" disabled>
                State (for your invoice)
              </option>
              {INDIAN_STATE_NAMES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep("choice");
                }}
                className="rounded-lg border-2 border-line px-5 py-3.5 text-sm font-bold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-sky-400 px-7 py-3.5 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60"
              >
                {submitting ? "Checking…" : "Continue"}
              </button>
            </div>
          </form>
        )}

        {step === "pay" &&
          quote &&
          (() => {
            const q = quote;
            return (
              <div className="flex flex-col gap-4">
                <div className="rounded-lg bg-slate-50 p-4 text-sm">
                  {q.discountPaise > 0 && (
                    <>
                      <div className="flex justify-between opacity-70">
                        <span>Program fee</span>
                        <span className="line-through">{formatPaiseAsInr(q.originalFeePaise)}</span>
                      </div>
                      <div className="flex justify-between text-green-700">
                        <span>Coupon discount</span>
                        <span>-{formatPaiseAsInr(q.discountPaise)}</span>
                      </div>
                    </>
                  )}
                  <div className="mt-1 flex justify-between border-t border-line/60 pt-1 font-bold">
                    <span>Total fee</span>
                    <span>{formatPaiseAsInr(q.finalFeePaise)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-line px-4 py-3 text-sm has-[:checked]:border-sky-400">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentType === "full"}
                      onChange={() => setPaymentType("full")}
                    />
                    <span>
                      Pay full fee — <strong>{formatPaiseAsInr(q.finalFeePaise)}</strong>
                    </span>
                  </label>
                  {q.registrationFeePaise !== null && (
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-line px-4 py-3 text-sm has-[:checked]:border-sky-400">
                      <input
                        type="radio"
                        name="paymentType"
                        checked={paymentType === "registration"}
                        onChange={() => setPaymentType("registration")}
                      />
                      <span>
                        Pay registration fee —{" "}
                        <strong>{formatPaiseAsInr(q.registrationFeePaise)}</strong>
                      </span>
                    </label>
                  )}
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setStep("payDetails");
                    }}
                    className="rounded-lg border-2 border-line px-5 py-3.5 text-sm font-bold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={submitting}
                    className="flex-1 rounded-lg bg-sky-400 px-7 py-3.5 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60"
                  >
                    {submitting ? "Redirecting to payment…" : "Continue to payment"}
                  </button>
                </div>
              </div>
            );
          })()}

        {step === "demoDetails" && (
          <form onSubmit={handleDemoRequest} className="flex flex-col gap-4">
            <input
              name="name"
              type="text"
              aria-label="Full name"
              placeholder="Full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
            <input
              name="email"
              type="email"
              aria-label="Email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
            <input
              name="phone"
              type="tel"
              aria-label="Mobile number"
              placeholder="Mobile number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep("choice");
                }}
                className="rounded-lg border-2 border-line px-5 py-3.5 text-sm font-bold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-sky-400 px-7 py-3.5 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Request demo"}
              </button>
            </div>
          </form>
        )}

        {step === "demoSuccess" && (
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm opacity-80">
              Thanks, {name.split(" ")[0] || "there"}! Our team will reach out shortly to schedule
              your demo for {programName}.
            </p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              className="w-full rounded-lg bg-sky-400 px-7 py-3.5 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105"
            >
              Done
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
