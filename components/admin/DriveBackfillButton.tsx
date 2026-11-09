"use client";

import { useState } from "react";

/**
 * One-time (re-runnable) action to push every invoice/admission letter PDF
 * already generated before Drive sync existed into the configured Drive
 * folder. Everything generated from now on syncs automatically — this is
 * only for catching up on the backlog.
 */
export default function DriveBackfillButton() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleRun() {
    if (!confirm("Push every existing invoice and admission letter PDF to Google Drive? Safe to run more than once.")) {
      return;
    }

    setRunning(true);
    setResult(null);
    const res = await fetch("/api/admin/drive-backfill", { method: "POST" });
    const data = await res.json().catch(() => null);
    setRunning(false);

    if (!res.ok || !data) {
      setResult("Couldn't run the sync — check that Drive is configured and try again.");
      return;
    }

    setResult(
      `Invoices: ${data.invoices.uploaded}/${data.invoices.total} synced${data.invoices.failed ? `, ${data.invoices.failed} failed` : ""}. ` +
        `Admission letters: ${data.letters.uploaded}/${data.letters.total} synced${data.letters.failed ? `, ${data.letters.failed} failed` : ""}.`,
    );
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
      {result && <p className="mt-3 text-xs">{result}</p>}
    </div>
  );
}
