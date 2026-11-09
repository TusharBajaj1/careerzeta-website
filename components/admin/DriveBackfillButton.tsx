"use client";

import { useState } from "react";

type SyncGroupResult = { uploaded: number; failed: number; total: number; errors: string[] };

/**
 * One-time (re-runnable) action to push every invoice/admission letter PDF
 * already generated before Drive sync existed into the configured Drive
 * folder. Everything generated from now on syncs automatically — this is
 * only for catching up on the backlog.
 */
export default function DriveBackfillButton() {
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleRun() {
    if (!confirm("Push every existing invoice and admission letter PDF to Google Drive? Safe to run more than once.")) {
      return;
    }

    setRunning(true);
    setSummary(null);
    setErrors([]);
    const res = await fetch("/api/admin/drive-backfill", { method: "POST" });
    const data = await res.json().catch(() => null);
    setRunning(false);

    if (!res.ok || !data) {
      setSummary("Couldn't run the sync — check that Drive is configured and try again.");
      return;
    }

    const invoices: SyncGroupResult = data.invoices;
    const letters: SyncGroupResult = data.letters;

    setSummary(
      `Invoices: ${invoices.uploaded}/${invoices.total} synced${invoices.failed ? `, ${invoices.failed} failed` : ""}. ` +
        `Admission letters: ${letters.uploaded}/${letters.total} synced${letters.failed ? `, ${letters.failed} failed` : ""}.`,
    );
    setErrors([...invoices.errors, ...letters.errors]);
  }

  return (
    <div className="rounded-lg border-2 border-line bg-white px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-semibold">Sync existing PDFs to Google Drive</div>
          <p className="mt-1 text-xs opacity-60">
            New invoices and admission letters sync automatically. Run this once to back-fill everything
            generated before Drive sync was set up.
          </p>
        </div>
        <button
          onClick={handleRun}
          disabled={running}
          className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {running ? "Syncing…" : "Run sync"}
        </button>
      </div>
      {summary && <p className="mt-3 text-xs">{summary}</p>}
      {errors.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1 rounded-lg bg-red-50 p-3 text-xs text-red-700">
          {errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
