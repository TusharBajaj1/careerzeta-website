"use client";

import { useState } from "react";

import { defaultAdmissionLetterBody } from "@/lib/admissionLetterTemplate";
import { PROGRAMS } from "@/lib/content";
import { formatPaiseAsInr } from "@/lib/money";

export type AdmissionRow = {
  id: number;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  programSlug: string;
  totalFee: number;
  batchDetails: string | null;
  admissionLetterBody: string | null;
  admissionNumber: string | null;
  admissionLetterSent: boolean;
  admissionLetterSentAt: string | null;
};

export default function AdmissionsClient({ initialAdmissions }: { initialAdmissions: AdmissionRow[] }) {
  const [admissions, setAdmissions] = useState<AdmissionRow[]>(initialAdmissions);

  function handleUpdate(id: number, patch: Partial<AdmissionRow>) {
    setAdmissions((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  return (
    <div className="mt-8">
      <h1 className="font-display text-3xl font-bold">Admissions</h1>
      <p className="mt-2 text-sm opacity-60">
        Every candidate who has completed full payment. Set their batch, edit the letter&apos;s wording if
        needed, then send or resend — it always picks up whatever&apos;s saved at send time.
      </p>

      <div className="mt-8 overflow-x-auto">
        {admissions.length === 0 ? (
          <p className="text-sm opacity-60">No one&apos;s completed full payment yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-line text-xs tracking-wide uppercase opacity-60">
                <th className="py-2 pr-4">Candidate</th>
                <th className="py-2 pr-4">Program</th>
                <th className="py-2 pr-4">Fee Paid</th>
                <th className="py-2 pr-4">Batch Details</th>
                <th className="py-2 pr-4">Admission Letter</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((a) => (
                <AdmissionRowItem key={a.id} admission={a} onUpdate={(patch) => handleUpdate(a.id, patch)} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function AdmissionRowItem({
  admission,
  onUpdate,
}: {
  admission: AdmissionRow;
  onUpdate: (patch: Partial<AdmissionRow>) => void;
}) {
  const [editingBatch, setEditingBatch] = useState(false);
  const [batchValue, setBatchValue] = useState(admission.batchDetails ?? "");
  const [savingBatch, setSavingBatch] = useState(false);
  const [sending, setSending] = useState(false);
  const [editingLetter, setEditingLetter] = useState(false);

  const programName = PROGRAMS.find((p) => p.slug === admission.programSlug)?.name ?? admission.programSlug;

  async function handleSaveBatch() {
    setSavingBatch(true);
    const res = await fetch(`/api/admin/enrollments/${admission.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batchDetails: batchValue }),
    });
    setSavingBatch(false);

    if (!res.ok) {
      alert("Couldn't save batch details — try again.");
      return;
    }
    onUpdate({ batchDetails: batchValue.trim() || null });
    setEditingBatch(false);
  }

  async function handleSend() {
    const verb = admission.admissionLetterSent ? "Resend" : "Send";
    if (!confirm(`${verb} the admission letter to ${admission.candidateEmail}?`)) return;

    setSending(true);
    const res = await fetch(`/api/admin/enrollments/${admission.id}/send-admission-letter`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setSending(false);

    if (!res.ok) {
      alert("Couldn't send the admission letter — try again.");
      return;
    }
    if (!data.sent) {
      alert("Processed, but the email couldn't be sent — check the address and try again.");
    } else {
      alert(`Sent to ${admission.candidateEmail}.`);
    }
    onUpdate({
      admissionLetterSent: true,
      admissionLetterSentAt: new Date().toISOString(),
      admissionNumber: data.admissionNumber ?? admission.admissionNumber,
    });
  }

  return (
    <>
      <tr className="border-b border-line/60">
        <td className="py-3 pr-4">
          <div className="font-semibold">{admission.candidateName}</div>
          <div className="text-xs opacity-60">{admission.candidateEmail}</div>
        </td>
        <td className="py-3 pr-4 opacity-70">{programName}</td>
        <td className="py-3 pr-4 font-semibold">{formatPaiseAsInr(admission.totalFee)}</td>
        <td className="py-3 pr-4">
          {editingBatch ? (
            <div className="flex min-w-[220px] flex-wrap items-center gap-2">
              <input
                aria-label="Batch details"
                value={batchValue}
                onChange={(e) => setBatchValue(e.target.value)}
                placeholder="e.g. Batch 14 — starts 15 Jan"
                className="min-w-[180px] flex-1 rounded-lg border-2 border-line px-2 py-1 text-sm outline-none focus:border-sky-400"
              />
              <button
                onClick={handleSaveBatch}
                disabled={savingBatch}
                className="rounded-lg bg-sky-700 px-2 py-1 text-xs font-bold text-white disabled:opacity-60"
              >
                {savingBatch ? "Saving…" : "Save"}
              </button>
              <button onClick={() => setEditingBatch(false)} className="text-xs opacity-60 hover:underline">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className={admission.batchDetails ? "" : "opacity-60"}>
                {admission.batchDetails || "Not set"}
              </span>
              <button
                onClick={() => {
                  setBatchValue(admission.batchDetails ?? "");
                  setEditingBatch(true);
                }}
                className="text-xs font-semibold text-sky-700 hover:underline"
              >
                {admission.batchDetails ? "Edit" : "Set"}
              </button>
            </div>
          )}
        </td>
        <td className="py-3 pr-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              admission.admissionLetterSent ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            {admission.admissionLetterSent ? "Sent" : "Not sent"}
          </span>
          {admission.admissionNumber && (
            <div className="mt-1 text-xs opacity-60">{admission.admissionNumber}</div>
          )}
        </td>
        <td className="py-3 pr-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSend}
              disabled={sending}
              className="text-xs font-semibold text-sky-700 hover:underline disabled:opacity-50"
            >
              {sending ? "Sending…" : admission.admissionLetterSent ? "Resend" : "Send"}
            </button>
            <a
              href={`/api/admin/enrollments/${admission.id}/download-admission-letter`}
              className="text-xs font-semibold text-sky-700 hover:underline"
            >
              Download
            </a>
            <button
              onClick={() => setEditingLetter((v) => !v)}
              className="text-xs font-semibold text-sky-700 hover:underline"
            >
              {editingLetter ? "Close" : "Edit letter"}
            </button>
          </div>
        </td>
      </tr>
      {editingLetter && (
        <tr className="border-b border-line/60">
          <td colSpan={6} className="bg-slate-50 py-4 pr-4">
            <LetterBodyEditor
              admission={admission}
              programName={programName}
              onUpdate={onUpdate}
              onDone={() => setEditingLetter(false)}
            />
          </td>
        </tr>
      )}
    </>
  );
}

function LetterBodyEditor({
  admission,
  programName,
  onUpdate,
  onDone,
}: {
  admission: AdmissionRow;
  programName: string;
  onUpdate: (patch: Partial<AdmissionRow>) => void;
  onDone: () => void;
}) {
  const defaultText = defaultAdmissionLetterBody({
    candidateName: admission.candidateName,
    programName,
    totalFeePaise: admission.totalFee,
  });
  const [text, setText] = useState(admission.admissionLetterBody ?? defaultText);
  const [saving, setSaving] = useState(false);
  const isCustom = !!admission.admissionLetterBody;

  async function save(value: string) {
    setSaving(true);
    const res = await fetch(`/api/admin/enrollments/${admission.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admissionLetterBody: value }),
    });
    setSaving(false);

    if (!res.ok) {
      alert("Couldn't save the letter text — try again.");
      return false;
    }
    onUpdate({ admissionLetterBody: value.trim() || null });
    return true;
  }

  async function handleSave() {
    if (await save(text)) onDone();
  }

  async function handleResetToDefault() {
    if (!confirm("Clear your custom wording and revert to the default letter text?")) return;
    if (await save("")) {
      setText(defaultText);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold tracking-wide uppercase opacity-60">
          Letter text {isCustom ? "(customized)" : "(default)"}
        </p>
        <p className="text-xs opacity-50">
          The letterhead, batch card, candidate details and footer stay fixed — this is the message in between.
        </p>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        className="w-full rounded-lg border-2 border-line bg-white px-4 py-3 font-mono text-sm outline-none focus:border-sky-400"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-sky-700 px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {isCustom && (
          <button onClick={handleResetToDefault} className="text-xs font-semibold text-red-600 hover:underline">
            Reset to default
          </button>
        )}
        <button onClick={onDone} className="text-xs opacity-60 hover:underline">
          Cancel
        </button>
      </div>
    </div>
  );
}
