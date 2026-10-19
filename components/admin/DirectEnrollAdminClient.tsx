"use client";

import { useState, type FormEvent } from "react";

import { PROGRAMS } from "@/lib/content";
import { INDIAN_STATE_NAMES } from "@/lib/indianStates";

/**
 * The simplified counterpart to the coupon-based enroll flow: no discount
 * codes, no registration-fee split — just the candidate's details and the
 * one absolute amount they owe. Posts to the same /api/admin/enrollments
 * endpoint the main Enrollments page uses (it already supports this shape),
 * so everything created here shows up there too for payment/invoice
 * management.
 */
export default function DirectEnrollAdminClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [programSlug, setProgramSlug] = useState(PROGRAMS[0]?.slug ?? "");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const res = await fetch("/api/admin/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        state,
        programSlug,
        totalFee: Number(amount),
        registrationFeeAmount: null,
      }),
    });

    if (!res.ok) {
      setError("Couldn't create the enrollment — check the fields and try again.");
      setSubmitting(false);
      return;
    }

    setSuccess(`Done — ${name} can now go to /enroll-direct and pay with ${email} + their phone number.`);
    setName("");
    setEmail("");
    setPhone("");
    setState("");
    setAmount("");
    setSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 grid gap-5 rounded-2xl border-2 border-line bg-white p-6 sm:grid-cols-2"
    >
      <div>
        <label htmlFor="direct-name" className="mb-1.5 block text-xs font-bold text-slate-700">
          Candidate Name
        </label>
        <input
          id="direct-name"
          placeholder="Full name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <div>
        <label htmlFor="direct-email" className="mb-1.5 block text-xs font-bold text-slate-700">
          Candidate Email
        </label>
        <input
          id="direct-email"
          type="email"
          placeholder="candidate@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <div>
        <label htmlFor="direct-phone" className="mb-1.5 block text-xs font-bold text-slate-700">
          Candidate Phone
        </label>
        <input
          id="direct-phone"
          type="tel"
          placeholder="9999999999"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <div>
        <label htmlFor="direct-state" className="mb-1.5 block text-xs font-bold text-slate-700">
          Candidate State
        </label>
        <select
          id="direct-state"
          required
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        >
          <option value="" disabled>
            Select state (for GST invoice)
          </option>
          {INDIAN_STATE_NAMES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="direct-program" className="mb-1.5 block text-xs font-bold text-slate-700">
          Program
        </label>
        <select
          id="direct-program"
          value={programSlug}
          onChange={(e) => setProgramSlug(e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        >
          {PROGRAMS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="direct-amount" className="mb-1.5 block text-xs font-bold text-slate-700">
          Amount to Pay (₹)
        </label>
        <input
          id="direct-amount"
          type="number"
          min="1"
          placeholder="e.g. 105000"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>

      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
      {success && <p className="text-sm text-green-700 sm:col-span-2">{success}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-fit rounded-lg bg-sky-400 px-7 py-3 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60 sm:col-span-2"
      >
        {submitting ? "Creating…" : "Create enrollment"}
      </button>
    </form>
  );
}
