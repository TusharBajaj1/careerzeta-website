"use client";

import { useState } from "react";

import { PROGRAMS } from "@/lib/content";

export type DemoRequestRow = {
  id: number;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  programSlug: string;
  contacted: boolean;
  createdAt: string;
};

export default function DemoRequestsClient({
  initialRequests,
}: {
  initialRequests: DemoRequestRow[];
}) {
  const [requests, setRequests] = useState<DemoRequestRow[]>(initialRequests);

  async function toggleContacted(id: number, contacted: boolean) {
    await fetch(`/api/admin/demo-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacted }),
    });
    const res = await fetch("/api/admin/demo-requests");
    const data = await res.json();
    setRequests(data.demoRequests ?? []);
  }

  return (
    <div className="mt-10 overflow-x-auto">
      {requests.length === 0 ? (
        <p className="text-sm opacity-60">No demo requests yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-line text-xs tracking-wide uppercase opacity-60">
              <th className="py-2 pr-4">Candidate</th>
              <th className="py-2 pr-4">Program</th>
              <th className="py-2 pr-4">Requested</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b border-line/60">
                <td className="py-3 pr-4">
                  <div className="font-semibold">{r.candidateName}</div>
                  <div className="text-xs opacity-60">
                    {r.candidateEmail} · {r.candidatePhone}
                  </div>
                </td>
                <td className="py-3 pr-4">
                  {PROGRAMS.find((p) => p.slug === r.programSlug)?.name ?? r.programSlug}
                </td>
                <td className="py-3 pr-4">{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      r.contacted ? "bg-green-100 text-green-700" : "bg-slate-100"
                    }`}
                  >
                    {r.contacted ? "Contacted" : "New"}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <button
                    onClick={() => toggleContacted(r.id, !r.contacted)}
                    className="text-sky-700 hover:underline"
                  >
                    {r.contacted ? "Mark as new" : "Mark contacted"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
