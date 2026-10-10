"use client";

import { useState, type FormEvent } from "react";

import { PROGRAMS } from "@/lib/content";

export type CouponRow = {
  id: number;
  code: string;
  discountPercent: number | null;
  discountAmount: number | null;
  programSlug: string | null;
  candidateEmail: string | null;
  candidatePhone: string | null;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  status: "active" | "used" | "expired" | "revoked";
  createdBy: string | null;
  notes: string | null;
  createdAt: string;
};

function discountLabel(c: CouponRow) {
  if (c.discountPercent) return `${c.discountPercent}% off`;
  if (c.discountAmount) return `₹${(c.discountAmount / 100).toLocaleString("en-IN")} off`;
  return "—";
}

export default function CouponsClient({ initialCoupons }: { initialCoupons: CouponRow[] }) {
  const [coupons, setCoupons] = useState<CouponRow[]>(initialCoupons);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "amount">("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [programSlug, setProgramSlug] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [maxUses, setMaxUses] = useState("1");
  const [expiresAt, setExpiresAt] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [notes, setNotes] = useState("");

  async function refresh() {
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    setCoupons(data.coupons ?? []);
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        discountType,
        discountValue: Number(discountValue),
        programSlug: programSlug || null,
        candidateEmail: candidateEmail || null,
        candidatePhone: candidatePhone || null,
        maxUses: Number(maxUses),
        expiresAt: expiresAt || null,
        createdBy,
        notes,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(
        data.error === "code_already_exists"
          ? "That coupon code already exists."
          : data.error === "candidate_restriction_required"
            ? "Add the candidate's email or phone — coupons can't be unrestricted."
            : "Couldn't create the coupon — check the fields and try again.",
      );
      setSubmitting(false);
      return;
    }

    setCode("");
    setDiscountValue("");
    setProgramSlug("");
    setCandidateEmail("");
    setCandidatePhone("");
    setMaxUses("1");
    setExpiresAt("");
    setNotes("");
    setSubmitting(false);
    refresh();
  }

  async function handleRevoke(id: number) {
    if (!confirm("Revoke this coupon? It can't be un-revoked.")) return;
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "revoked" }),
    });
    refresh();
  }

  return (
    <>
      <form
        onSubmit={handleCreate}
        className="mt-8 grid gap-4 rounded-2xl border-2 border-line bg-white p-6 sm:grid-cols-2"
      >
        <input
          placeholder="Coupon code (e.g. ZETA10)"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
        <input
          placeholder="Your name / initials"
          required
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          className="rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />

        <div className="flex gap-2 sm:col-span-2">
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as "percent" | "amount")}
            className="rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
          >
            <option value="percent">% off</option>
            <option value="amount">₹ off</option>
          </select>
          <input
            type="number"
            min="1"
            placeholder={discountType === "percent" ? "e.g. 10" : "e.g. 5000"}
            required
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="flex-1 rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
          />
        </div>

        <select
          value={programSlug}
          onChange={(e) => setProgramSlug(e.target.value)}
          className="rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        >
          <option value="">Any program</option>
          {PROGRAMS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          placeholder="Max uses (default 1)"
          value={maxUses}
          onChange={(e) => setMaxUses(e.target.value)}
          className="rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />

        <input
          type="email"
          placeholder="Candidate email"
          value={candidateEmail}
          onChange={(e) => setCandidateEmail(e.target.value)}
          className="rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
        <input
          type="tel"
          placeholder="Candidate phone"
          value={candidatePhone}
          onChange={(e) => setCandidatePhone(e.target.value)}
          className="rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
        <p className="text-xs opacity-60 sm:col-span-2">
          At least one of email/phone is required — this is what restricts the coupon to a
          specific candidate.
        </p>

        <input
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
        <input
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />

        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-fit rounded-lg bg-sky-400 px-7 py-3 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60 sm:col-span-2"
        >
          {submitting ? "Creating…" : "Create coupon"}
        </button>
      </form>

      <div className="mt-10 overflow-x-auto">
        {coupons.length === 0 ? (
          <p className="text-sm opacity-60">No coupons yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-line text-xs tracking-wide uppercase opacity-60">
                <th className="py-2 pr-4">Code</th>
                <th className="py-2 pr-4">Discount</th>
                <th className="py-2 pr-4">Program</th>
                <th className="py-2 pr-4">Candidate</th>
                <th className="py-2 pr-4">Used</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">By</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-line/60">
                  <td className="py-3 pr-4 font-mono font-semibold">{c.code}</td>
                  <td className="py-3 pr-4">{discountLabel(c)}</td>
                  <td className="py-3 pr-4">
                    {PROGRAMS.find((p) => p.slug === c.programSlug)?.name ?? "Any"}
                  </td>
                  <td className="py-3 pr-4">{c.candidateEmail || c.candidatePhone || "—"}</td>
                  <td className="py-3 pr-4">
                    {c.usedCount}/{c.maxUses}
                  </td>
                  <td className="py-3 pr-4 capitalize">{c.status}</td>
                  <td className="py-3 pr-4">{c.createdBy}</td>
                  <td className="py-3 pr-4">
                    {c.status === "active" && (
                      <button
                        onClick={() => handleRevoke(c.id)}
                        className="text-red-600 hover:underline"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
