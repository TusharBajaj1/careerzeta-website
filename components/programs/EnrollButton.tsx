"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";

type EnrollButtonProps = {
  programSlug: string;
  programName: string;
};

export default function EnrollButton({ programSlug, programName }: EnrollButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programSlug, name, email, phone, couponCode }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          data.error === "invalid_coupon"
            ? data.reason
            : data.error === "not_configured"
              ? "Payments aren't set up yet — please contact us directly to enroll."
              : "Something went wrong — please try again, or contact us directly.",
        );
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

      <Modal open={open} onClose={() => setOpen(false)} title={`Enroll — ${programName}`}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            {submitting ? "Redirecting to payment…" : "Continue to payment"}
          </button>
        </form>
      </Modal>
    </>
  );
}
