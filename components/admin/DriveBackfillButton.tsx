"use client";

import { useState } from "react";

type SyncGroupResult = { uploaded: number; failed: number; total: number; errors: string[] };

/**
 * New invoices/admission letters sync to Drive automatically — this is
 * just a manual catch-up for anything that was missed (a transient Drive
 * outage, or documents generated before Drive sync existed). Deliberately
 * low-key: not something anyone needs to look at day to day.
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
      setSummary("Couldn't run the sync.");
      return;
    }

    const invoices: SyncGroupResult = data.invoices;
    const letters: SyncGroupResult = data.letters;
    setSummary(`Invoices ${invoices.uploaded}/${invoices.total}, letters ${letters.uploaded}/${letters.total} synced.`);
    setErrors([...invoices.errors, ...letters.errors]);
  }

  return (
    <div className="text-xs opacity-70">
      <span>Invoices and admission letters sync to Google Drive automatically. </span>
      <button onClick={handleRun} disabled={running} className="font-semibold text-sky-700 hover:underline disabled:opacity-50">
        {running ? "Syncing…" : "Re-sync existing PDFs"}
      </button>
      {summary && <span> — {summary}</span>}
      {errors.length > 0 && (
        <details className="mt-1">
          <summary className="cursor-pointer text-red-600">{errors.length} error(s)</summary>
          <ul className="mt-1 flex flex-col gap-1 text-red-600">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
