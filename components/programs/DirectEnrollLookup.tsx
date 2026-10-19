"use client";

import { useState, type FormEvent } from "react";

import { formatPaiseAsInr } from "@/lib/money";

type Quote = {
  enrollmentId: number;
  programName: string;
  totalFeePaise: number;
  registrationFeePaise: number | null;
};

type Step = "lookup" | "pay";

function errorMessage(status: number): string {
  if (status === 404) {
    return "We couldn't find a pending enrollment for that email and phone number — double-check them, or contact us if you believe this is a mistake.";
  }
  return "Something went wrong — please try again, or contact us directly.";
}

/**
 * The simplified alternative to EnrollButton's coupon-code flow: no coupon
 * box, no listed-price self-serve option — every enrollment here was
 * created by an admin with an exact amount already agreed with the
 * candidate. The candidate's only job is to confirm who they are and pay.
 */
export default function DirectEnrollLookup() {
  const [step, setStep] = useState<Step>("lookup");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [paymentType, setPaymentType] = useState<"full" | "registration">("full");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleLookup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/enroll-direct/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(errorMessage(res.status));
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
        setError(errorMessage(res.status));
        setSubmitting(false);
        return;
      }

      window.location.href = data.paymentLinkUrl;
    } catch {
      setError("Something went wrong — please try again, or contact us directly.");
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border-2 border-line bg-white p-6 sm:p-8">
      {step === "lookup" && (
        <form onSubmit={handleLookup} className="flex flex-col gap-4">
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

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-sky-400 px-7 py-3.5 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60"
          >
            {submitting ? "Checking…" : "Find my fee"}
          </button>
        </form>
      )}

      {step === "pay" &&
        quote &&
        (() => {
          const q = quote;
          return (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-slate-50 p-4 text-sm">
                <div className="font-bold">{q.programName}</div>
                <div className="mt-1 flex justify-between">
                  <span>Amount due</span>
                  <span className="font-bold">{formatPaiseAsInr(q.totalFeePaise)}</span>
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
                    Pay full fee — <strong>{formatPaiseAsInr(q.totalFeePaise)}</strong>
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
                      Pay registration fee — <strong>{formatPaiseAsInr(q.registrationFeePaise)}</strong>
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
                    setQuote(null);
                    setStep("lookup");
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
    </div>
  );
}
