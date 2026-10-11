"use client";

import { useState, type FormEvent } from "react";

import { PROGRAMS } from "@/lib/content";
import { formatPaiseAsInr, paiseToRupees } from "@/lib/money";

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
  salesExecutive: string | null;
  totalFee: number;
  registrationFeeAmount: number | null;
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
  const [registrationFeeAmount, setRegistrationFeeAmount] = useState("");
  const [salesExecutive, setSalesExecutive] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/admin/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        programSlug,
        totalFee: Number(totalFee),
        registrationFeeAmount: registrationFeeAmount ? Number(registrationFeeAmount) : null,
        salesExecutive,
      }),
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
      className="mt-6 grid gap-5 rounded-2xl border-2 border-line bg-white p-6 sm:grid-cols-2"
    >
      <div>
        <label htmlFor="enrollment-name" className="mb-1.5 block text-xs font-bold text-slate-700">
          Candidate Name
        </label>
        <input
          id="enrollment-name"
          placeholder="Full name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <div>
        <label htmlFor="enrollment-email" className="mb-1.5 block text-xs font-bold text-slate-700">
          Candidate Email
        </label>
        <input
          id="enrollment-email"
          type="email"
          placeholder="candidate@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <div>
        <label htmlFor="enrollment-phone" className="mb-1.5 block text-xs font-bold text-slate-700">
          Candidate Phone
        </label>
        <input
          id="enrollment-phone"
          type="tel"
          placeholder="9999999999"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <div>
        <label htmlFor="enrollment-program" className="mb-1.5 block text-xs font-bold text-slate-700">
          Program
        </label>
        <select
          id="enrollment-program"
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
      <div className="sm:col-span-2">
        <label htmlFor="enrollment-total-fee" className="mb-1.5 block text-xs font-bold text-slate-700">
          Total Agreed Fee (₹, after any discount)
        </label>
        <input
          id="enrollment-total-fee"
          type="number"
          min="1"
          placeholder="e.g. 105000"
          required
          value={totalFee}
          onChange={(e) => setTotalFee(e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <div>
        <label htmlFor="enrollment-sales-exec" className="mb-1.5 block text-xs font-bold text-slate-700">
          Sales Executive (lead owner)
        </label>
        <input
          id="enrollment-sales-exec"
          placeholder="Your name / initials"
          value={salesExecutive}
          onChange={(e) => setSalesExecutive(e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <div>
        <label
          htmlFor="enrollment-registration-fee"
          className="mb-1.5 block text-xs font-bold text-slate-700"
        >
          Registration Fee Amount (optional)
        </label>
        <input
          id="enrollment-registration-fee"
          type="number"
          min="1"
          placeholder="₹ amount, e.g. 10000"
          value={registrationFeeAmount}
          onChange={(e) => setRegistrationFeeAmount(e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <p className="-mt-2 text-xs opacity-60 sm:col-span-2">
        Optional — if set, this exact amount automatically shows up as the &quot;pay a
        registration fee&quot; option when this candidate enrolls themselves on /programs
        (matched by email), without needing a coupon.
      </p>

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

  async function handleCancel() {
    if (!confirm("Cancel this enrollment? It can't be un-cancelled.")) return;
    await fetch(`/api/admin/enrollments/${enrollment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    onChanged();
  }

  async function handleDelete() {
    if (!confirm("Delete this enrollment permanently? This can't be undone.")) return;
    await fetch(`/api/admin/enrollments/${enrollment.id}`, { method: "DELETE" });
    onChanged();
  }


  return (
    <div className="rounded-2xl border-2 border-line bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-display text-lg font-bold">{enrollment.candidateName}</div>
          <div className="text-sm opacity-70">
            {enrollment.candidateEmail} · {enrollment.candidatePhone}
          </div>
          <div className="mt-1 text-sm font-semibold text-sky-700">{programName}</div>
          {enrollment.salesExecutive && (
            <div className="mt-1 text-xs opacity-60">Sales Executive: {enrollment.salesExecutive}</div>
          )}
          {enrollment.registrationFeeAmount !== null && (
            <div className="mt-1 text-xs opacity-60">
              Registration fee offered: {formatPaiseAsInr(enrollment.registrationFeeAmount)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold whitespace-nowrap">
            {STATUS_LABEL[enrollment.status]}
          </span>
          {enrollment.status !== "cancelled" && (
            <button onClick={handleCancel} className="text-sm text-red-600 hover:underline">
              Cancel
            </button>
          )}
          {enrollment.amountPaid === 0 && (
            <button onClick={handleDelete} className="text-sm text-red-600 hover:underline">
              Delete
            </button>
          )}
        </div>
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
                {p.status !== "paid" && (
                  <div className="flex items-center gap-3">
                    {p.paymentLinkUrl && (
                      <a
                        href={p.paymentLinkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-700 hover:underline"
                      >
                        Payment link
                      </a>
                    )}
                    <MarkPaidControl payment={p} onConfirmed={onChanged} />
                  </div>
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

function MarkPaidControl({ payment, onConfirmed }: { payment: PaymentRow; onConfirmed: () => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(paiseToRupees(payment.amount)));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (
      !confirm(
        "Mark this payment as received? This sends the invoice email to the candidate right away — only do this once the money has actually come in.",
      )
    ) {
      return;
    }

    setSubmitting(true);
    const res = await fetch(`/api/admin/payments/${payment.id}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount) }),
    });

    if (!res.ok) {
      setError("Couldn't confirm the payment — try again.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setOpen(false);
    onConfirmed();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-green-700 hover:underline">
        Mark as Paid
      </button>
    );
  }

  return (
    <form onSubmit={handleConfirm} className="flex items-center gap-2">
      <input
        type="number"
        min="1"
        step="0.01"
        aria-label="Amount actually received (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-28 rounded-lg border-2 border-line px-2 py-1.5 text-sm outline-none focus:border-sky-400"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-green-700 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
      >
        {submitting ? "Confirming…" : "Confirm"}
      </button>
      <button type="button" onClick={() => setOpen(false)} className="text-xs opacity-60 hover:underline">
        Cancel
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </form>
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
        aria-label="Payment type"
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
        aria-label="Amount (₹)"
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
