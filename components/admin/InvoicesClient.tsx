"use client";

import { Fragment, useMemo, useState } from "react";

import { PROGRAMS } from "@/lib/content";
import { formatPaiseAsInr } from "@/lib/money";

export type InvoiceRow = {
  id: number;
  enrollmentId: number;
  type: "full" | "registration" | "balance";
  amount: number;
  invoiceNumber: string;
  invoicePdfUrl: string | null;
  invoiceSent: boolean;
  invoiceCancelled: boolean;
  invoiceCancelledAt: string | null;
  paidAt: string | null;
  createdAt: string;
  candidateName: string;
  candidateEmail: string;
  programSlug: string;
  creditNoteNumber: string | null;
  creditNoteSent: boolean;
};

const PAYMENT_TYPE_LABEL: Record<InvoiceRow["type"], string> = {
  full: "Full Payment",
  registration: "Registration Fee",
  balance: "Balance Payment",
};

/** Default input value: the last day of the current month, in YYYY-MM-DD. */
function defaultCloseDate(): string {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.toISOString().slice(0, 10);
}

export default function InvoicesClient({
  initialInvoices,
  initialBooksClosedThrough,
}: {
  initialInvoices: InvoiceRow[];
  initialBooksClosedThrough: string | null;
}) {
  const [invoices, setInvoices] = useState<InvoiceRow[]>(initialInvoices);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [booksClosedThrough, setBooksClosedThrough] = useState<string | null>(initialBooksClosedThrough);
  const [closeDateInput, setCloseDateInput] = useState(defaultCloseDate());
  const [closing, setClosing] = useState(false);
  const [creditNoteFormOpenId, setCreditNoteFormOpenId] = useState<number | null>(null);
  const [creditNoteReason, setCreditNoteReason] = useState("");
  const [issuingCreditNoteId, setIssuingCreditNoteId] = useState<number | null>(null);
  const [sendingCreditNoteId, setSendingCreditNoteId] = useState<number | null>(null);

  /** Cancelled invoices are void — excluded from revenue the same way they're excluded from any accounting record. */
  const summary = useMemo(() => {
    const active = invoices.filter((inv) => !inv.invoiceCancelled);
    const totalRevenue = active.reduce((sum, inv) => sum + inv.amount, 0);
    return {
      totalRevenue,
      count: active.length,
      cancelledCount: invoices.length - active.length,
    };
  }, [invoices]);

  /** An invoice issued on or before the close point is booked — no more regenerate/refresh/cancel, a credit note is needed instead. */
  function isLocked(inv: InvoiceRow): boolean {
    if (!booksClosedThrough) return false;
    const issuedAt = new Date(inv.paidAt ?? inv.createdAt).getTime();
    return issuedAt <= new Date(booksClosedThrough).getTime();
  }

  async function handleCloseBooks() {
    if (!closeDateInput) return;
    const label = new Date(closeDateInput).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (
      !confirm(
        `Close the books through ${label}? Every invoice issued on or before this date becomes locked — no more regenerating, refreshing, or cancelling. This can't be undone (the close point can only move forward).`,
      )
    ) {
      return;
    }

    setClosing(true);
    // End of the chosen day, so an invoice issued any time that day counts as before the close point.
    const endOfDay = new Date(`${closeDateInput}T23:59:59.999`);
    const res = await fetch("/api/admin/accounting-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: endOfDay.toISOString() }),
    });
    const data = await res.json().catch(() => ({}));
    setClosing(false);

    if (!res.ok) {
      alert(
        data.error === "must_be_later_than_current"
          ? "That date isn't later than the current close point — pick a later date."
          : "Couldn't close the books — try again.",
      );
      return;
    }
    setBooksClosedThrough(data.booksClosedThrough);
  }

  async function handleGenerate(invoice: InvoiceRow) {
    setSendingId(invoice.id);
    const res = await fetch(`/api/admin/payments/${invoice.id}/generate-invoice`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setSendingId(null);

    if (!res.ok) {
      alert(
        data.error === "invoice_locked"
          ? "This invoice is booked in the accounts and locked — a credit note is needed to correct it, not a regenerate."
          : "Couldn't generate the invoice — try again.",
      );
      return;
    }
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoice.id
          ? {
              ...inv,
              invoiceNumber: data.invoiceNumber,
              invoicePdfUrl: data.pdfUrl ?? inv.invoicePdfUrl,
              invoiceCancelled: false,
              invoiceCancelledAt: null,
              invoiceSent: false,
            }
          : inv,
      ),
    );
  }

  async function handleSend(invoice: InvoiceRow) {
    if (
      !confirm(
        `${invoice.invoiceSent ? "Resend this invoice" : "Send this invoice"} to ${invoice.candidateName} (${invoice.candidateEmail})? This will email their current address.`,
      )
    ) {
      return;
    }

    setSendingId(invoice.id);
    const res = await fetch(`/api/admin/payments/${invoice.id}/send-invoice`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setSendingId(null);

    if (!res.ok) {
      alert("Couldn't send the invoice — try again.");
      return;
    }
    if (!data.sent) {
      alert("Couldn't send the email — check the address and try again.");
      return;
    }
    alert(`Sent to ${invoice.candidateEmail} (invoice ${data.invoiceNumber}).`);
    setInvoices((prev) => prev.map((inv) => (inv.id === invoice.id ? { ...inv, invoiceSent: true } : inv)));
  }

  async function handleRefreshDrive(invoice: InvoiceRow) {
    setBusyId(invoice.id);
    const res = await fetch(`/api/admin/payments/${invoice.id}/refresh-drive-invoice`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setBusyId(null);

    if (!res.ok) {
      alert(
        data.error === "not_configured"
          ? "Google Drive sync isn't configured on this environment — nothing to refresh here."
          : data.error === "invoice_locked"
            ? "This invoice is booked in the accounts and locked — a credit note is needed to correct it, not a refresh."
            : "Couldn't refresh the Drive copy — try again.",
      );
      return;
    }
    alert("Drive copy refreshed.");
  }

  async function handleCancel(invoice: InvoiceRow) {
    if (!confirm(`Cancel invoice ${invoice.invoiceNumber}? No email is sent — this just marks it void.`)) {
      return;
    }

    setBusyId(invoice.id);
    const res = await fetch(`/api/admin/payments/${invoice.id}/cancel-invoice`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setBusyId(null);

    if (!res.ok) {
      alert(
        data.error === "invoice_locked"
          ? "This invoice is booked in the accounts and locked — a credit note is needed to void it, not a cancel."
          : "Couldn't cancel this invoice — try again.",
      );
      return;
    }

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoice.id
          ? { ...inv, invoiceCancelled: true, invoiceCancelledAt: new Date().toISOString() }
          : inv,
      ),
    );
  }

  function openCreditNoteForm(invoiceId: number) {
    setCreditNoteReason("");
    setCreditNoteFormOpenId(invoiceId);
  }

  async function handleIssueCreditNote(invoice: InvoiceRow) {
    const reason = creditNoteReason.trim();
    if (!reason) {
      alert("A reason is required for the credit note.");
      return;
    }
    if (
      !confirm(
        `Issue a credit note for the full amount of invoice ${invoice.invoiceNumber} (${formatPaiseAsInr(invoice.amount)})? This can't be undone.`,
      )
    ) {
      return;
    }

    setIssuingCreditNoteId(invoice.id);
    const res = await fetch(`/api/admin/payments/${invoice.id}/credit-note`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json().catch(() => ({}));
    setIssuingCreditNoteId(null);

    if (!res.ok) {
      alert(
        data.error === "credit_note_already_exists"
          ? "A credit note has already been issued for this invoice."
          : "Couldn't issue the credit note — try again.",
      );
      return;
    }

    setCreditNoteFormOpenId(null);
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoice.id ? { ...inv, creditNoteNumber: data.creditNote.creditNoteNumber, creditNoteSent: false } : inv,
      ),
    );
  }

  async function handleSendCreditNote(invoice: InvoiceRow) {
    if (
      !confirm(
        `${invoice.creditNoteSent ? "Resend" : "Send"} credit note ${invoice.creditNoteNumber} to ${invoice.candidateName} (${invoice.candidateEmail})?`,
      )
    ) {
      return;
    }

    setSendingCreditNoteId(invoice.id);
    const res = await fetch(`/api/admin/payments/${invoice.id}/credit-note/send`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setSendingCreditNoteId(null);

    if (!res.ok || !data.sent) {
      alert("Couldn't send the credit note — check the address and try again.");
      return;
    }
    alert(`Sent to ${invoice.candidateEmail}.`);
    setInvoices((prev) => prev.map((inv) => (inv.id === invoice.id ? { ...inv, creditNoteSent: true } : inv)));
  }

  return (
    <div className="mt-8">
      <h1 className="font-display text-3xl font-bold">Invoices</h1>
      <p className="mt-2 text-sm opacity-60">
        Every invoice ever issued, across all enrollments. Cancelling one here is an internal
        record only — no email goes out — and it doesn&apos;t touch the enrollment&apos;s payment or
        status, see Enrollments for that. Generating an invoice never emails anyone either; only
        Send/Resend does.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border-2 border-line bg-slate-50 p-5">
        <div>
          <div className="text-xs font-bold tracking-wide uppercase opacity-60">Total Revenue</div>
          <div className="mt-1 font-display text-2xl font-bold text-green-700">
            {formatPaiseAsInr(summary.totalRevenue)}
          </div>
          {summary.cancelledCount > 0 && (
            <div className="mt-0.5 text-xs opacity-50">
              excludes {summary.cancelledCount} cancelled invoice{summary.cancelledCount === 1 ? "" : "s"}
            </div>
          )}
        </div>
        <div>
          <div className="text-xs font-bold tracking-wide uppercase opacity-60">Invoices Issued</div>
          <div className="mt-1 font-display text-2xl font-bold">{summary.count}</div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
        <div className="text-xs font-bold tracking-wide uppercase text-amber-800">Accounting Lock</div>
        <p className="mt-1 text-sm text-amber-900">
          {booksClosedThrough ? (
            <>
              Books are closed through{" "}
              <span className="font-bold">
                {new Date(booksClosedThrough).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              . Any invoice issued on or before that date is locked — regenerate, refresh, and
              cancel are disabled for it; a credit note is needed to correct it instead.
            </>
          ) : (
            "Nothing is locked yet — every invoice can still be regenerated, refreshed, or cancelled."
          )}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={closeDateInput}
            onChange={(e) => setCloseDateInput(e.target.value)}
            className="rounded-lg border-2 border-line bg-white px-3 py-2 text-sm outline-none focus:border-sky-400"
          />
          <button
            onClick={handleCloseBooks}
            disabled={closing}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition-transform duration-150 hover:scale-105 disabled:opacity-60"
          >
            {closing ? "Closing…" : "Close books through this date"}
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        {invoices.length === 0 ? (
          <p className="text-sm opacity-60">No invoices issued yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-line text-xs tracking-wide uppercase opacity-60">
                <th className="py-2 pr-4">Invoice #</th>
                <th className="py-2 pr-4">Candidate</th>
                <th className="py-2 pr-4">Program</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Paid</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const locked = isLocked(inv);
                return (
                  <Fragment key={inv.id}>
                    <tr className="border-b border-line/60">
                      <td className="py-3 pr-4 font-semibold whitespace-nowrap">{inv.invoiceNumber}</td>
                      <td className="py-3 pr-4">
                        <div className="font-semibold">{inv.candidateName}</div>
                        <div className="text-xs opacity-60">{inv.candidateEmail}</div>
                      </td>
                      <td className="py-3 pr-4 opacity-70">
                        {PROGRAMS.find((p) => p.slug === inv.programSlug)?.name ?? inv.programSlug}
                      </td>
                      <td className="py-3 pr-4 opacity-70">{PAYMENT_TYPE_LABEL[inv.type]}</td>
                      <td className="py-3 pr-4 font-semibold">{formatPaiseAsInr(inv.amount)}</td>
                      <td className="py-3 pr-4">
                        {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            inv.invoiceCancelled
                              ? "bg-red-100 text-red-700"
                              : inv.invoiceSent
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {inv.invoiceCancelled ? "Cancelled" : inv.invoiceSent ? "Sent" : "Not sent"}
                        </span>
                        {inv.creditNoteNumber && (
                          <div className="mt-1 text-xs font-semibold text-amber-700">
                            CN: {inv.creditNoteNumber}
                          </div>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap items-center gap-3">
                          {locked && (
                            <span
                              title="Booked in the accounts — a credit note is needed to correct this invoice."
                              className="text-xs font-semibold text-slate-500"
                            >
                              🔒 Booked
                            </span>
                          )}
                          {!locked && (
                            <>
                              {inv.invoiceCancelled && (
                                <button
                                  onClick={() => handleGenerate(inv)}
                                  disabled={sendingId === inv.id}
                                  className="text-xs font-semibold text-sky-700 hover:underline disabled:opacity-50"
                                >
                                  {sendingId === inv.id ? "Generating…" : "Generate new invoice"}
                                </button>
                              )}
                              {!inv.invoiceCancelled && !inv.invoiceSent && (
                                <button
                                  onClick={() => handleGenerate(inv)}
                                  disabled={sendingId === inv.id}
                                  className="text-xs font-semibold text-sky-700 hover:underline disabled:opacity-50"
                                >
                                  {sendingId === inv.id ? "Generating…" : "Regenerate"}
                                </button>
                              )}
                            </>
                          )}
                          {!inv.invoiceCancelled && (
                            <button
                              onClick={() => handleSend(inv)}
                              disabled={sendingId === inv.id}
                              className="text-xs font-semibold text-sky-700 hover:underline disabled:opacity-50"
                            >
                              {sendingId === inv.id ? "Sending…" : inv.invoiceSent ? "Resend" : "Send"}
                            </button>
                          )}
                          <a
                            href={`/api/admin/payments/${inv.id}/download-invoice`}
                            className="text-xs font-semibold text-sky-700 hover:underline"
                          >
                            Download
                          </a>
                          {!locked && (
                            <button
                              onClick={() => handleRefreshDrive(inv)}
                              disabled={busyId === inv.id}
                              className="text-xs font-semibold text-sky-700 hover:underline disabled:opacity-50"
                            >
                              {busyId === inv.id ? "Refreshing…" : "Refresh in Drive"}
                            </button>
                          )}
                          {!locked && !inv.invoiceCancelled && (
                            <button
                              onClick={() => handleCancel(inv)}
                              disabled={busyId === inv.id}
                              className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                            >
                              {busyId === inv.id ? "Cancelling…" : "Cancel invoice"}
                            </button>
                          )}

                          {inv.creditNoteNumber ? (
                            <>
                              <a
                                href={`/api/admin/payments/${inv.id}/credit-note/download`}
                                className="text-xs font-semibold text-amber-700 hover:underline"
                              >
                                Download CN
                              </a>
                              <button
                                onClick={() => handleSendCreditNote(inv)}
                                disabled={sendingCreditNoteId === inv.id}
                                className="text-xs font-semibold text-amber-700 hover:underline disabled:opacity-50"
                              >
                                {sendingCreditNoteId === inv.id
                                  ? "Sending…"
                                  : inv.creditNoteSent
                                    ? "Resend CN"
                                    : "Send CN"}
                              </button>
                            </>
                          ) : (
                            !inv.invoiceCancelled && (
                              <button
                                onClick={() =>
                                  creditNoteFormOpenId === inv.id
                                    ? setCreditNoteFormOpenId(null)
                                    : openCreditNoteForm(inv.id)
                                }
                                className="text-xs font-semibold text-amber-700 hover:underline"
                              >
                                {creditNoteFormOpenId === inv.id ? "Cancel" : "Issue Credit Note"}
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                    {creditNoteFormOpenId === inv.id && (
                      <tr className="border-b border-line/60">
                        <td colSpan={8} className="bg-amber-50 py-4 pr-4">
                          <div className="flex flex-col gap-2 px-2">
                            <label htmlFor={`cn-reason-${inv.id}`} className="text-xs font-bold tracking-wide uppercase opacity-60">
                              Reason for credit note (required)
                            </label>
                            <textarea
                              id={`cn-reason-${inv.id}`}
                              value={creditNoteReason}
                              onChange={(e) => setCreditNoteReason(e.target.value)}
                              rows={2}
                              placeholder="e.g. Candidate name corrected from X to Y"
                              className="w-full max-w-xl rounded-lg border-2 border-line bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                            />
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleIssueCreditNote(inv)}
                                disabled={issuingCreditNoteId === inv.id}
                                className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
                              >
                                {issuingCreditNoteId === inv.id ? "Issuing…" : "Issue Credit Note"}
                              </button>
                              <button
                                onClick={() => setCreditNoteFormOpenId(null)}
                                className="text-xs opacity-60 hover:underline"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
