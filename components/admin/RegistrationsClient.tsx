"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { PROGRAMS } from "@/lib/content";
import { formatPaiseAsInr } from "@/lib/money";

export type RegistrationRow = {
  id: number;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  programSlug: string;
  totalFee: number;
  amountPaid: number;
  status: "registration_paid" | "fully_paid";
};

export default function RegistrationsClient({ initialRegistrations }: { initialRegistrations: RegistrationRow[] }) {
  const [registrations] = useState<RegistrationRow[]>(initialRegistrations);

  const { newOnes, admitted } = useMemo(() => {
    return {
      newOnes: registrations.filter((r) => r.status === "registration_paid"),
      admitted: registrations.filter((r) => r.status === "fully_paid"),
    };
  }, [registrations]);

  return (
    <div className="mt-8">
      <h1 className="font-display text-3xl font-bold">Registrations</h1>
      <p className="mt-2 text-sm opacity-60">
        Everyone who has ever paid a registration fee — still mid-funnel (New) or since admitted
        after paying the balance (Admitted).
      </p>

      <h2 className="mt-8 text-xs font-bold tracking-wide uppercase opacity-60">New ({newOnes.length})</h2>
      <div className="mt-3 overflow-x-auto">
        {newOnes.length === 0 ? (
          <p className="text-sm opacity-60">No one&apos;s at the registration-paid stage right now.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-line text-xs tracking-wide uppercase opacity-60">
                <th className="py-2 pr-4">Candidate</th>
                <th className="py-2 pr-4">Program</th>
                <th className="py-2 pr-4">Registration Fee Paid</th>
                <th className="py-2 pr-4">Remaining</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {newOnes.map((r) => (
                <RegistrationRowItem key={r.id} registration={r} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 className="mt-12 text-xs font-bold tracking-wide uppercase opacity-60">Admitted ({admitted.length})</h2>
      <div className="mt-3 overflow-x-auto">
        {admitted.length === 0 ? (
          <p className="text-sm opacity-60">No one from the registration-fee path has been admitted yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-line text-xs tracking-wide uppercase opacity-60">
                <th className="py-2 pr-4">Candidate</th>
                <th className="py-2 pr-4">Program</th>
                <th className="py-2 pr-4">Total Fee Paid</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {admitted.map((r) => {
                const programName = PROGRAMS.find((p) => p.slug === r.programSlug)?.name ?? r.programSlug;
                return (
                  <tr key={r.id} className="border-b border-line/60">
                    <td className="py-3 pr-4">
                      <div className="font-semibold">{r.candidateName}</div>
                      <div className="text-xs opacity-60">{r.candidateEmail}</div>
                    </td>
                    <td className="py-3 pr-4 opacity-70">{programName}</td>
                    <td className="py-3 pr-4 font-semibold">{formatPaiseAsInr(r.amountPaid)}</td>
                    <td className="py-3 pr-4">
                      <Link href="/admin/admissions" className="text-xs font-semibold text-sky-700 hover:underline">
                        View in Admissions →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function RegistrationRowItem({ registration }: { registration: RegistrationRow }) {
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const programName = PROGRAMS.find((p) => p.slug === registration.programSlug)?.name ?? registration.programSlug;
  const remaining = registration.totalFee - registration.amountPaid;

  async function handleSend() {
    if (!confirm(`Send the registration-confirmation letter to ${registration.candidateEmail}?`)) return;

    setSending(true);
    const res = await fetch(`/api/admin/enrollments/${registration.id}/send-registration-confirmation`, {
      method: "POST",
    });
    const data = await res.json().catch(() => ({}));
    setSending(false);

    if (!res.ok) {
      alert("Couldn't send the registration letter — try again.");
      return;
    }
    if (!data.sent) {
      alert("Letter processed, but the email couldn't be sent — check the address and try again.");
    } else {
      alert(`Sent to ${registration.candidateEmail}.`);
    }
  }

  async function handleRefreshDrive() {
    setRefreshing(true);
    const res = await fetch(`/api/admin/enrollments/${registration.id}/refresh-registration-letter-drive`, {
      method: "POST",
    });
    setRefreshing(false);

    if (!res.ok) {
      alert("Couldn't refresh the Drive copy — try again.");
      return;
    }
    alert("Drive copy refreshed.");
  }

  return (
    <tr className="border-b border-line/60">
      <td className="py-3 pr-4">
        <div className="font-semibold">{registration.candidateName}</div>
        <div className="text-xs opacity-60">{registration.candidateEmail}</div>
      </td>
      <td className="py-3 pr-4 opacity-70">{programName}</td>
      <td className="py-3 pr-4 font-semibold">{formatPaiseAsInr(registration.amountPaid)}</td>
      <td className="py-3 pr-4 font-semibold">{formatPaiseAsInr(Math.max(remaining, 0))}</td>
      <td className="py-3 pr-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSend}
            disabled={sending}
            className="text-xs font-semibold text-sky-700 hover:underline disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send"}
          </button>
          <a
            href={`/api/admin/enrollments/${registration.id}/download-registration-confirmation`}
            className="text-xs font-semibold text-sky-700 hover:underline"
          >
            Download
          </a>
          <button
            onClick={handleRefreshDrive}
            disabled={refreshing}
            className="text-xs font-semibold text-sky-700 hover:underline disabled:opacity-50"
          >
            {refreshing ? "Refreshing…" : "Refresh in Drive"}
          </button>
        </div>
      </td>
    </tr>
  );
}
