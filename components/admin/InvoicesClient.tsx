"use client";

import { useState } from "react";

import { PROGRAMS } from "@/lib/content";
import { formatPaiseAsInr } from "@/lib/money";

export type InvoiceRow = {
  id: number;
  enrollmentId: number;
  type: "full" | "registration" | "balance";
  amount: number;
  invoiceNumber: string;
  invoicePdfUrl: string | null;
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

  async function handleSend(invoice: InvoiceRow) {
    const verb = invoice.invoiceCancelled ? "issue a new invoice to" : "resend the invoice to";
    if (!confirm(`${invoice.invoiceCancelled ? "Issue a new invoice" : "Resend this invoice"} to ${invoice.candidateName} (${invoice.candidateEmail})? This will ${verb} their current email.`)) {
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
      alert("Invoice processed, but the email couldn't be sent — check the address and try again.");
    }
    if (data.fresh) {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoice.id
            ? { ...inv, invoiceNumber: data.invoiceNumber, invoiceCancelled: false, invoiceCancelledAt: null }
            : inv,
        ),
      );
    }
  }

  async function handleCancel(invoice: InvoiceRow) {
    if (
      !confirm(
        `Cancel invoice ${invoice.invoiceNumber}? This emails ${invoice.candidateName} (${invoice.candidateEmail}) — the enrollment this payment is currently on — asking them to disregard it. Make sure that's who the invoice actually needs to go to before confirming.`,
      )
    ) {
      return;
    }

    setBusyId(invoice.id);
    const res = await fetch(`/api/admin/payments/${invoice.id}/cancel-invoice`, { method: "POST" });
    setBusyId(null);

    if (!res.ok) {
      alert("Couldn't cancel this invoice — try again.");
      return;
    }

    const data = await res.json().catch(() => ({}));
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoice.id
          ? { ...inv, invoiceCancelled: true, invoiceCancelledAt: new Date().toISOString() }
          : inv,
      ),
    );
    if (!data.noticeSent) {
      alert("Invoice marked cancelled, but the notice email couldn't be sent — you may want to follow up manually.");
    }
  }

  return (
    <div className="mt-8">
      <h1 className="font-display text-3xl font-bold">Invoices</h1>
      <p className="mt-2 text-sm opacity-60">
        Every invoice ever issued, across all enrollments. Cancelling one here is an internal record
        (and sends a notice to the candidate) — it doesn&apos;t touch the enrollment&apos;s payment or
        status, see Enrollments for that.
      </p>

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
                        inv.invoiceCancelled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {inv.invoiceCancelled ? "Cancelled" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleSend(inv)}
                        disabled={sendingId === inv.id}
                        className="text-xs font-semibold text-sky-700 hover:underline disabled:opacity-50"
                      >
                        {sendingId === inv.id ? "Sending…" : inv.invoiceCancelled ? "Issue new invoice" : "Resend"}
                      </button>
                      <a
                        href={`/api/admin/payments/${inv.id}/download-invoice`}
                        className="text-xs font-semibold text-sky-700 hover:underline"
                      >
                        Download
                      </a>
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
