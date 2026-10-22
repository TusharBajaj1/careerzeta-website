"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Download, Plus } from "lucide-react";

import { PROGRAMS } from "@/lib/content";
import { INDIAN_STATE_NAMES } from "@/lib/indianStates";
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

export type EnrollmentStatus = "pending" | "registration_paid" | "fully_paid" | "refund_requested" | "cancelled";

export type EnrollmentRow = {
  id: number;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateState: string | null;
  candidateAddress: string | null;
  candidateGstin: string | null;
  programSlug: string;
  couponId: number | null;
  salesExecutive: string | null;
  totalFee: number;
  registrationFeeAmount: number | null;
  amountPaid: number;
  status: EnrollmentStatus;
  createdAt: string;
  payments: PaymentRow[];
};

const STATUS_LABEL: Record<EnrollmentStatus, string> = {
  pending: "New",
  registration_paid: "Registered",
  fully_paid: "Paid in Full",
  refund_requested: "Asked for Refund",
  cancelled: "Cancelled",
};

/**
 * Status colors carry meaning (not just identity), so they follow the
 * good/warning/critical/neutral convention already used elsewhere on this
 * page (green for paid, red for cancel/refund) rather than an arbitrary
 * palette — always paired with the text label, never color alone.
 */
const STATUS_BADGE: Record<EnrollmentStatus, string> = {
  pending: "bg-slate-100 text-slate-700",
  registration_paid: "bg-amber-100 text-amber-800",
  fully_paid: "bg-green-100 text-green-800",
  refund_requested: "bg-red-100 text-red-800",
  cancelled: "bg-slate-100 text-slate-500",
};

const PIE_COLOR: Record<"pending" | "registration_paid" | "fully_paid" | "refund_requested", string> = {
  pending: "#94a3b8",
  registration_paid: "#d97706",
  fully_paid: "#15803d",
  refund_requested: "#dc2626",
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
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Enrollments</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/api/admin/enrollments/export"
            className="flex items-center gap-2 rounded-lg border-2 border-line bg-white px-5 py-3 text-sm font-bold transition hover:border-sky-400"
          >
            <Download className="h-4 w-4" aria-hidden />
            Export to Excel
          </Link>
          <button
            onClick={() => setShowCreate((v) => !v)}
            aria-label={showCreate ? "Cancel new enrollment" : "New enrollment"}
            className="flex items-center gap-2 rounded-lg bg-sky-400 px-6 py-3 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105"
          >
            {showCreate ? (
              "Cancel"
            ) : (
              <>
                <Plus className="h-4 w-4" aria-hidden />
                New Enrollment
              </>
            )}
          </button>
        </div>
      </div>

      <EnrollmentStatusChart enrollments={enrollments} />

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

const PIE_BUCKETS: { status: "pending" | "registration_paid" | "fully_paid" | "refund_requested"; label: string }[] =
  [
    { status: "pending", label: STATUS_LABEL.pending },
    { status: "registration_paid", label: STATUS_LABEL.registration_paid },
    { status: "fully_paid", label: STATUS_LABEL.fully_paid },
    { status: "refund_requested", label: STATUS_LABEL.refund_requested },
  ];

/** Donut breakdown of the four live statuses — cancelled enrollments are excluded since they're not part of this funnel. */
function EnrollmentStatusChart({ enrollments }: { enrollments: EnrollmentRow[] }) {
  const counts = useMemo(() => {
    const byStatus = { pending: 0, registration_paid: 0, fully_paid: 0, refund_requested: 0 };
    for (const e of enrollments) {
      if (e.status in byStatus) byStatus[e.status as keyof typeof byStatus]++;
    }
    return byStatus;
  }, [enrollments]);

  const total = counts.pending + counts.registration_paid + counts.fully_paid + counts.refund_requested;

  if (total === 0) return null;

  const radius = 60;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  const segments = PIE_BUCKETS.reduce<
    { status: (typeof PIE_BUCKETS)[number]["status"]; label: string; count: number; fraction: number; dash: number; offset: number }[]
  >((acc, { status, label }) => {
    const count = counts[status];
    const fraction = count / total;
    const dash = fraction * circumference;
    const offset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
    acc.push({ status, label, count, fraction, dash, offset });
    return acc;
  }, []);

  return (
    <div className="mt-8 flex flex-col items-center gap-8 rounded-2xl border-2 border-line bg-white p-6 sm:flex-row sm:items-center">
      <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label="Enrollment status breakdown">
        <g transform="translate(80,80) rotate(-90)">
          <circle r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
          {segments
            .filter((s) => s.count > 0)
            .map((s) => (
              <circle
                key={s.status}
                r={radius}
                fill="none"
                stroke={PIE_COLOR[s.status]}
                strokeWidth={strokeWidth}
                strokeDasharray={`${s.dash} ${circumference - s.dash}`}
                strokeDashoffset={-s.offset}
              >
                <title>
                  {s.label}: {s.count} ({Math.round(s.fraction * 100)}%)
                </title>
              </circle>
            ))}
        </g>
        <text x="80" y="76" textAnchor="middle" className="fill-slate-900 text-2xl font-bold">
          {total}
        </text>
        <text x="80" y="94" textAnchor="middle" className="fill-slate-500 text-[11px] font-semibold uppercase">
          total
        </text>
      </svg>

      <ul className="flex flex-1 flex-col gap-2.5 text-sm">
        {segments.map((s) => (
          <li key={s.status} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: PIE_COLOR[s.status] }}
              />
              {s.label}
            </span>
            <span className="font-bold">
              {s.count} <span className="font-normal opacity-60">({Math.round(s.fraction * 100)}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type EnrollmentFieldsValue = {
  name: string;
  email: string;
  phone: string;
  state: string;
  address: string;
  gstin: string;
  programSlug: string;
  totalFee: string;
  registrationFeeAmount: string;
  salesExecutive: string;
};

/** Shared field set used by both the create and edit forms, so validation/layout only lives in one place. */
function EnrollmentFields({
  idPrefix,
  value,
  onChange,
  feeMismatch,
}: {
  idPrefix: string;
  value: EnrollmentFieldsValue;
  onChange: <K extends keyof EnrollmentFieldsValue>(key: K, v: EnrollmentFieldsValue[K]) => void;
  feeMismatch: boolean;
}) {
  return (
    <>
      <div>
        <label htmlFor={`${idPrefix}-name`} className="mb-1.5 block text-xs font-bold text-slate-700">
          Candidate Name
        </label>
        <input
          id={`${idPrefix}-name`}
          placeholder="Full name"
          required
          value={value.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-email`} className="mb-1.5 block text-xs font-bold text-slate-700">
          Candidate Email
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          placeholder="candidate@example.com"
          required
          value={value.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-phone`} className="mb-1.5 block text-xs font-bold text-slate-700">
          Candidate Phone
        </label>
        <input
          id={`${idPrefix}-phone`}
          type="tel"
          inputMode="numeric"
          placeholder="9876543210"
          pattern="[6-9][0-9]{9}"
          maxLength={10}
          title="10-digit Indian mobile number"
          required
          value={value.phone}
          onChange={(e) => onChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-state`} className="mb-1.5 block text-xs font-bold text-slate-700">
          Candidate State
        </label>
        <select
          id={`${idPrefix}-state`}
          required
          value={value.state}
          onChange={(e) => onChange("state", e.target.value)}
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
      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-address`} className="mb-1.5 block text-xs font-bold text-slate-700">
          Billing Address (optional, shown on invoice)
        </label>
        <textarea
          id={`${idPrefix}-address`}
          rows={2}
          placeholder="Street, city, PIN code"
          value={value.address}
          onChange={(e) => onChange("address", e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-gstin`} className="mb-1.5 block text-xs font-bold text-slate-700">
          GSTIN (optional, for employer-paid invoices)
        </label>
        <input
          id={`${idPrefix}-gstin`}
          placeholder="22AAAAA0000A1Z5"
          maxLength={15}
          value={value.gstin}
          onChange={(e) => onChange("gstin", e.target.value.toUpperCase())}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm uppercase outline-none focus:border-sky-400"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-program`} className="mb-1.5 block text-xs font-bold text-slate-700">
          Program
        </label>
        <select
          id={`${idPrefix}-program`}
          value={value.programSlug}
          onChange={(e) => onChange("programSlug", e.target.value)}
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
        <label htmlFor={`${idPrefix}-total-fee`} className="mb-1.5 block text-xs font-bold text-slate-700">
          Total Agreed Fee (₹, after any discount)
        </label>
        <input
          id={`${idPrefix}-total-fee`}
          type="number"
          min="1"
          placeholder="e.g. 105000"
          required
          value={value.totalFee}
          onChange={(e) => onChange("totalFee", e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-sales-exec`} className="mb-1.5 block text-xs font-bold text-slate-700">
          Sales Executive (lead owner)
        </label>
        <input
          id={`${idPrefix}-sales-exec`}
          placeholder="Your name / initials"
          value={value.salesExecutive}
          onChange={(e) => onChange("salesExecutive", e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-registration-fee`} className="mb-1.5 block text-xs font-bold text-slate-700">
          Registration Fee Amount (optional)
        </label>
        <input
          id={`${idPrefix}-registration-fee`}
          type="number"
          min="1"
          placeholder="₹ amount, e.g. 10000"
          value={value.registrationFeeAmount}
          onChange={(e) => onChange("registrationFeeAmount", e.target.value)}
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
        {feeMismatch && (
          <p className="mt-1.5 text-xs font-semibold text-red-600">
            Registration fee must be less than the total fee.
          </p>
        )}
      </div>
      <p className="-mt-2 text-xs opacity-60 sm:col-span-2">
        Registration fee is optional — if set, the candidate sees both a &quot;pay
        registration fee&quot; and &quot;pay full fee&quot; option when they enter their
        details to pay.
      </p>
    </>
  );
}

const EMPTY_FIELDS: EnrollmentFieldsValue = {
  name: "",
  email: "",
  phone: "",
  state: "",
  address: "",
  gstin: "",
  programSlug: PROGRAMS[0]?.slug ?? "",
  totalFee: "",
  registrationFeeAmount: "",
  salesExecutive: "",
};

function CreateEnrollmentForm({ onCreated }: { onCreated: () => void }) {
  const [fields, setFields] = useState<EnrollmentFieldsValue>(EMPTY_FIELDS);
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const feeMismatch =
    fields.registrationFeeAmount !== "" && Number(fields.registrationFeeAmount) >= Number(fields.totalFee || 0);

  function handleChange<K extends keyof EnrollmentFieldsValue>(key: K, v: EnrollmentFieldsValue[K]) {
    setFields((f) => ({ ...f, [key]: v }));
  }

  function handleReview(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (feeMismatch) return;
    setStep("confirm");
  }

  async function handleConfirm() {
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/admin/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fields.name,
        email: fields.email,
        phone: fields.phone,
        state: fields.state,
        address: fields.address,
        gstin: fields.gstin,
        programSlug: fields.programSlug,
        totalFee: Number(fields.totalFee),
        registrationFeeAmount: fields.registrationFeeAmount ? Number(fields.registrationFeeAmount) : null,
        salesExecutive: fields.salesExecutive,
      }),
    });

    if (!res.ok) {
      setError("Couldn't create the enrollment — check the fields and try again.");
      setSubmitting(false);
      setStep("form");
      return;
    }

    setSubmitting(false);
    onCreated();
  }

  if (step === "confirm") {
    const program = PROGRAMS.find((p) => p.slug === fields.programSlug);
    return (
      <div className="mt-6 flex flex-col gap-5 rounded-2xl border-2 border-sky-400 bg-sky-50 p-6">
        <h3 className="font-display text-lg font-bold">Confirm before creating</h3>
        <dl className="grid gap-2.5 text-sm sm:grid-cols-2">
          <div>
            <dt className="opacity-60">Candidate</dt>
            <dd className="font-bold">{fields.name}</dd>
          </div>
          <div>
            <dt className="opacity-60">Contact</dt>
            <dd className="font-bold">
              {fields.email} · {fields.phone}
            </dd>
          </div>
          <div>
            <dt className="opacity-60">Program</dt>
            <dd className="font-bold">{program?.name ?? fields.programSlug}</dd>
          </div>
          <div>
            <dt className="opacity-60">State</dt>
            <dd className="font-bold">{fields.state}</dd>
          </div>
          <div>
            <dt className="opacity-60">Total Fee</dt>
            <dd className="text-lg font-bold text-sky-700">
              {formatPaiseAsInr(Math.round(Number(fields.totalFee) * 100))}
            </dd>
          </div>
          <div>
            <dt className="opacity-60">Registration Fee</dt>
            <dd className="font-bold">
              {fields.registrationFeeAmount
                ? formatPaiseAsInr(Math.round(Number(fields.registrationFeeAmount) * 100))
                : "Not offered"}
            </dd>
          </div>
        </dl>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep("form")}
            className="rounded-lg border-2 border-line bg-white px-5 py-3 text-sm font-bold"
          >
            ← Back and edit
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-1 rounded-lg bg-sky-400 px-7 py-3 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Confirm and create"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleReview}
      className="mt-6 grid gap-5 rounded-2xl border-2 border-line bg-white p-6 sm:grid-cols-2"
    >
      <EnrollmentFields idPrefix="enrollment" value={fields} onChange={handleChange} feeMismatch={feeMismatch} />

      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}

      <button
        type="submit"
        disabled={feeMismatch}
        className="w-fit rounded-lg bg-sky-400 px-7 py-3 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60 sm:col-span-2"
      >
        Review and create
      </button>
    </form>
  );
}

function EditEnrollmentForm({
  enrollment,
  onSaved,
  onCancel,
}: {
  enrollment: EnrollmentRow;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [fields, setFields] = useState<EnrollmentFieldsValue>({
    name: enrollment.candidateName,
    email: enrollment.candidateEmail,
    phone: enrollment.candidatePhone,
    state: enrollment.candidateState ?? "",
    address: enrollment.candidateAddress ?? "",
    gstin: enrollment.candidateGstin ?? "",
    programSlug: enrollment.programSlug,
    totalFee: String(paiseToRupees(enrollment.totalFee)),
    registrationFeeAmount:
      enrollment.registrationFeeAmount !== null ? String(paiseToRupees(enrollment.registrationFeeAmount)) : "",
    salesExecutive: enrollment.salesExecutive ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const feeMismatch =
    fields.registrationFeeAmount !== "" && Number(fields.registrationFeeAmount) >= Number(fields.totalFee || 0);

  function handleChange<K extends keyof EnrollmentFieldsValue>(key: K, v: EnrollmentFieldsValue[K]) {
    setFields((f) => ({ ...f, [key]: v }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (feeMismatch) return;
    setSubmitting(true);

    const res = await fetch(`/api/admin/enrollments/${enrollment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fields.name,
        email: fields.email,
        phone: fields.phone,
        state: fields.state,
        address: fields.address,
        gstin: fields.gstin,
        programSlug: fields.programSlug,
        totalFee: Number(fields.totalFee),
        registrationFeeAmount: fields.registrationFeeAmount ? Number(fields.registrationFeeAmount) : null,
        salesExecutive: fields.salesExecutive,
      }),
    });

    if (!res.ok) {
      setError("Couldn't save — check the fields and try again.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 grid gap-5 rounded-xl border-2 border-sky-400 bg-sky-50 p-5 sm:grid-cols-2"
    >
      <EnrollmentFields
        idPrefix={`edit-${enrollment.id}`}
        value={fields}
        onChange={handleChange}
        feeMismatch={feeMismatch}
      />

      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}

      <div className="flex gap-3 sm:col-span-2">
        <button type="button" onClick={onCancel} className="rounded-lg border-2 border-line bg-white px-5 py-3 text-sm font-bold">
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || feeMismatch}
          className="rounded-lg bg-sky-400 px-7 py-3 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save changes"}
        </button>
      </div>
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
  const [editing, setEditing] = useState(false);
  const programName = PROGRAMS.find((p) => p.slug === enrollment.programSlug)?.name ?? enrollment.programSlug;
  const remaining = enrollment.totalFee - enrollment.amountPaid;
  const canEdit = enrollment.amountPaid === 0 && enrollment.status !== "cancelled";

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

  async function handleRefundRequested() {
    if (!confirm("Mark that this candidate has asked for a refund?")) return;
    await fetch(`/api/admin/enrollments/${enrollment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "refund_requested" }),
    });
    onChanged();
  }

  async function handleUndoRefundRequested() {
    await fetch(`/api/admin/enrollments/${enrollment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ undoRefundRequest: true }),
    });
    onChanged();
  }

  if (editing) {
    return (
      <div className="rounded-2xl border-2 border-line bg-white p-6">
        <EditEnrollmentForm enrollment={enrollment} onSaved={() => { setEditing(false); onChanged(); }} onCancel={() => setEditing(false)} />
      </div>
    );
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
          {enrollment.candidateState && (
            <div className="mt-1 text-xs opacity-60">State: {enrollment.candidateState}</div>
          )}
          {enrollment.candidateAddress && (
            <div className="mt-1 text-xs opacity-60">Address: {enrollment.candidateAddress}</div>
          )}
          {enrollment.candidateGstin && (
            <div className="mt-1 text-xs opacity-60">GSTIN: {enrollment.candidateGstin}</div>
          )}
          {enrollment.salesExecutive && (
            <div className="mt-1 text-xs opacity-60">Sales Executive: {enrollment.salesExecutive}</div>
          )}
          {enrollment.registrationFeeAmount !== null && (
            <div className="mt-1 text-xs opacity-60">
              Registration fee offered: {formatPaiseAsInr(enrollment.registrationFeeAmount)}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <span className={`rounded-full px-4 py-1.5 text-xs font-bold whitespace-nowrap ${STATUS_BADGE[enrollment.status]}`}>
            {STATUS_LABEL[enrollment.status]}
          </span>
          {canEdit && (
            <button onClick={() => setEditing(true)} className="text-sm text-sky-700 hover:underline">
              Edit
            </button>
          )}
          {enrollment.status === "refund_requested" ? (
            <button onClick={handleUndoRefundRequested} className="text-sm text-slate-600 hover:underline">
              Undo refund request
            </button>
          ) : (
            enrollment.status !== "cancelled" &&
            enrollment.amountPaid > 0 && (
              <button onClick={handleRefundRequested} className="text-sm text-red-600 hover:underline">
                Mark refund requested
              </button>
            )
          )}
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
