"use client";

import { useState, type FormEvent } from "react";

import { PROGRAMS } from "@/lib/content";
import { formatPaiseAsInr } from "@/lib/money";

export type PaymentRow = {
  id: number;
  enrollmentId: number;
  type: "full" | "registration" | "balance";
  amount: number;
  status: "created" | "paid" | "failed" | "expired";
  razorpayPaymentLinkId: string | null;
  razorpayPaymentId: string | null;
  paymentLinkUrl: string | null;
  paidAt: string | null;
  invoiceSent: boolean;
  invoiceNumber: string | null;
  createdAt: string;
};

export type EnrollmentRow = {
  id: number;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  programSlug: string;
  couponId: number | null;
  totalFee: number;
  amountPaid: number;
  status: "pending" | "registration_paid" | "fully_paid" | "cancelled";
  createdAt: string;
  payments: PaymentRow[];
};

const STATUS_LABEL: Record<EnrollmentRow["status"], string> = {
  pending: "Pending",
  registration_paid: "Registration Paid",
  fully_paid: "Fully Paid",
  cancelled: "Cancelled",
};

const PAYMENT_TYPE_LABEL: Record<PaymentRow["type"], string> = {
  full: "Full Payment",
  registration: "Registration Fee",
  balance: "Balance Payment",
};

export default function EnrollmentsClient({
  initialEnrollments,
}: {
  initialEnrollments: EnrollmentRow[];
}) {
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>(initialEnrollments);
  const [showCreate, setShowCreate] = useState(false);

  async function refresh() {
    const res = await fetch("/api/admin/enrollments");
    const data = await res.json();
    setEnrollments(data.enrollments ?? []);
  }

  return (
    <>
      <div className="mt-8">
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="rounded-lg bg-sky-400 px-6 py-3 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105"
        >
          {showCreate ? "Cancel" : "+ New Enrollment"}
        </button>
      </div>

      {showCreate && (
        <CreateEnrollmentForm
          onCreated={() => {
            setShowCreate(false);
            refresh();
          }}
        />
      )}

      <div className="mt-10 flex flex-col gap-6">
        {enrollments.length === 0 ? (
          <p className="text-sm opacity-60">No enrollments yet.</p>
        ) : (
          enrollments.map((enrollment) => (
            <EnrollmentCard key={enrollment.id} enrollment={enrollment} onChanged={refresh} />
          ))
        )}
      </div>
    </>
  );
}

function CreateEnrollmentForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [programSlug, setProgramSlug] = useState(PROGRAMS[0]?.slug ?? "");
  const [totalFee, setTotalFee] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/admin/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, programSlug, totalFee: Number(totalFee) }),
    });

    if (!res.ok) {
      setError("Couldn't create the enrollment — check the fields and try again.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 grid gap-4 rounded-2xl border-2 border-line bg-white p-6 sm:grid-cols-2"
    >
      <input
        placeholder="Candidate name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
      />
      <input
        type="email"
        placeholder="Candidate email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
      />
      <input
        type="tel"
        placeholder="Candidate phone"
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
      />
      <select
        value={programSlug}
        onChange={(e) => setProgramSlug(e.target.value)}
        className="rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
      >
        {PROGRAMS.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="1"
        placeholder="Total agreed fee (₹, after any discount)"
        required
        value={totalFee}
        onChange={(e) => setTotalFee(e.target.value)}
        className="rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400 sm:col-span-2"
      />

      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}

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

function EnrollmentCard({
  enrollment,
  onChanged,
}: {
  enrollment: EnrollmentRow;
  onChanged: () => void;
}) {
  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;
  const remaining = enrollment.totalFee - enrollment.amountPaid;

  return (
    <div className="rounded-2xl border-2 border-line bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-display text-lg font-bold">{enrollment.candidateName}</div>
          <div className="text-sm opacity-70">
            {enrollment.candidateEmail} · {enrollment.candidatePhone}
          </div>
          <div className="mt-1 text-sm font-semibold text-sky-700">{programName}</div>
        </div>
        <span className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold whitespace-nowrap">
          {STATUS_LABEL[enrollment.status]}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 border-y border-line/60 py-3 text-sm">
        <div>
          <div className="text-xs opacity-60">Total Fee</div>
          <div className="font-bold">{formatPaiseAsInr(enrollment.totalFee)}</div>
        </div>
        <div>
          <div className="text-xs opacity-60">Paid</div>
          <div className="font-bold">{formatPaiseAsInr(enrollment.amountPaid)}</div>
        </div>
        <div>
          <div className="text-xs opacity-60">Remaining</div>
          <div className="font-bold">{formatPaiseAsInr(Math.max(remaining, 0))}</div>
        </div>
      </div>

      {enrollment.payments.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-bold tracking-wide uppercase opacity-60">Payments</div>
          <ul className="mt-2 flex flex-col gap-2">
            {enrollment.payments.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>
                  {PAYMENT_TYPE_LABEL[p.type]} — {formatPaiseAsInr(p.amount)} —{" "}
                  <span className={p.status === "paid" ? "font-bold text-green-700" : "opacity-70"}>
                    {p.status}
                  </span>
                  {p.invoiceNumber && <span className="opacity-60"> ({p.invoiceNumber})</span>}
                </span>
                {p.status !== "paid" && p.paymentLinkUrl && (
                  <a
                    href={p.paymentLinkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-700 hover:underline"
                  >
                    Payment link
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {remaining > 0 && enrollment.status !== "cancelled" && (
        <AddPaymentForm enrollment={enrollment} onAdded={onChanged} />
      )}
    </div>
  );
}

function AddPaymentForm({
  enrollment,
  onAdded,
}: {
  enrollment: EnrollmentRow;
  onAdded: () => void;
}) {
  const hasPaid = enrollment.payments.some((p) => p.status === "paid");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"registration" | "balance" | "full">(hasPaid ? "balance" : "registration");
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLink(null);
    setSubmitting(true);

    const res = await fetch(`/api/admin/enrollments/${enrollment.id}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), type }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(
        data.error === "amount_exceeds_balance"
          ? "That amount is more than the remaining balance."
          : data.error === "not_configured"
            ? "Razorpay isn't configured yet."
            : "Couldn't create the payment link — try again.",
      );
      setSubmitting(false);
      return;
    }

    setLink(data.payment.paymentLinkUrl);
    setAmount("");
    setSubmitting(false);
    onAdded();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-wrap items-center gap-3 border-t border-line/60 pt-4"
    >
      <select
        value={type}
        onChange={(e) => setType(e.target.value as typeof type)}
        className="rounded-lg border-2 border-line px-3 py-2.5 text-sm outline-none focus:border-sky-400"
      >
        <option value="registration">Registration fee</option>
        <option value="balance">Balance payment</option>
        <option value="full">Full payment</option>
      </select>
      <input
        type="number"
        min="1"
        placeholder="Amount (₹)"
        required
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-40 rounded-lg border-2 border-line px-3 py-2.5 text-sm outline-none focus:border-sky-400"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-[#111827] px-5 py-2.5 text-sm font-bold text-white transition-transform duration-150 hover:scale-105 disabled:opacity-60"
      >
        {submitting ? "Generating…" : "Generate payment link"}
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
      {link && (
        <p className="w-full text-sm break-all text-green-700">
          Link ready:{" "}
          <a href={link} target="_blank" rel="noreferrer" className="underline">
            {link}
          </a>
        </p>
      )}
    </form>
  );
}
