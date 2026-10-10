"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import { formatPaiseAsInr } from "@/lib/money";

type EnrollButtonProps = {
  programSlug: string;
  programName: string;
};

type Quote = {
  originalFeePaise: number;
  discountPaise: number;
  finalFeePaise: number;
  registrationFeePaise: number;
};

type ApiError = { error?: string; reason?: string };

function errorMessage(data: ApiError): string {
  if (data.error === "invalid_coupon") return data.reason ?? "That coupon isn't valid.";
  if (data.error === "not_configured") {
    return "Payments aren't set up yet — please contact us directly to enroll.";
  }
  return "Something went wrong — please try again, or contact us directly.";
}

export default function EnrollButton({ programSlug, programName }: EnrollButtonProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"details" | "pay">("details");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [paymentType, setPaymentType] = useState<"full" | "registration">("full");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setStep("details");
    setName("");
    setEmail("");
    setPhone("");
    setCouponCode("");
    setQuote(null);
    setPaymentType("full");
    setError(null);
    setSubmitting(false);
  }

  async function handleContinue(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/enroll/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programSlug, email, phone, couponCode }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(errorMessage(data));
        setSubmitting(false);
        return;
      }

      setQuote(data);
      setStep("pay");
      setSubmitting(false);
    } catch {
      setError("Something went wrong — please try again, or contact us directly.");
      setSubmitting(false);
    }
  }

  async function handlePay() {
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programSlug, name, email, phone, couponCode, paymentType }),
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
        title={`Enroll — ${programName}`}
      >
        {step === "details" ? (
          <form onSubmit={handleContinue} className="flex flex-col gap-4">
            <input
              name="name"
              type="text"
              placeholder="Full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Mobile number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
            <input
              name="couponCode"
              type="text"
              placeholder="Coupon code (optional)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-lg bg-sky-400 px-7 py-3.5 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60"
            >
              {submitting ? "Checking…" : "Continue"}
            </button>
          </form>
        ) : (
          quote && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-slate-50 p-4 text-sm">
                {quote.discountPaise > 0 && (
                  <>
                    <div className="flex justify-between opacity-70">
                      <span>Program fee</span>
                      <span className="line-through">{formatPaiseAsInr(quote.originalFeePaise)}</span>
                    </div>
                    <div className="flex justify-between text-green-700">
                      <span>Coupon discount</span>
                      <span>-{formatPaiseAsInr(quote.discountPaise)}</span>
                    </div>
                  </>
                )}
                <div className="mt-1 flex justify-between border-t border-line/60 pt-1 font-bold">
                  <span>Total fee</span>
                  <span>{formatPaiseAsInr(quote.finalFeePaise)}</span>
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
                    Pay full fee — <strong>{formatPaiseAsInr(quote.finalFeePaise)}</strong>
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-line px-4 py-3 text-sm has-[:checked]:border-sky-400">
                  <input
                    type="radio"
                    name="paymentType"
                    checked={paymentType === "registration"}
                    onChange={() => setPaymentType("registration")}
                  />
                  <span>
                    Pay registration fee (10%) — <strong>{formatPaiseAsInr(quote.registrationFeePaise)}</strong>
                  </span>
                </label>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("details")}
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
          )
        )}
      </Modal>
    </>
  );
}
