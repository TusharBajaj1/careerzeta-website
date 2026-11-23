"use client";

import { useMemo, useState } from "react";

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
  candidateName: string;
  candidateEmail: string;
  programSlug: string;
};

const PAYMENT_TYPE_LABEL: Record<InvoiceRow["type"], string> = {
  full: "Full Payment",
  registration: "Registration Fee",
  balance: "Balance Payment",
};

export default function InvoicesClient({ initialInvoices }: { initialInvoices: InvoiceRow[] }) {
  const [invoices, setInvoices] = useState<InvoiceRow[]>(initialInvoices);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [sendingId, setSendingId] = useState<number | null>(null);

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

  async function handleGenerate(invoice: InvoiceRow) {
    setSendingId(invoice.id);
    const res = await fetch(`/api/admin/payments/${invoice.id}/generate-invoice`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setSendingId(null);

    if (!res.ok) {
      alert("Couldn't generate the invoice — try again.");
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
    setBusyId(null);

    if (!res.ok) {
      alert("Couldn't refresh the Drive copy — try again.");
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
    setBusyId(null);

    if (!res.ok) {
      alert("Couldn't cancel this invoice — try again.");
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
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-line/60">
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
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap items-center gap-3">
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
                      <button
                        onClick={() => handleRefreshDrive(inv)}
                        disabled={busyId === inv.id}
                        className="text-xs font-semibold text-sky-700 hover:underline disabled:opacity-50"
                      >
                        {busyId === inv.id ? "Refreshing…" : "Refresh in Drive"}
                      </button>
                      {!inv.invoiceCancelled && (
                        <button
                          onClick={() => handleCancel(inv)}
                          disabled={busyId === inv.id}
                          className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                        >
                          {busyId === inv.id ? "Cancelling…" : "Cancel invoice"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
