"use client";

import { useState, type FormEvent } from "react";

export default function WordOfTheDayForm({
  current,
}: {
  current: { word: string; definition: string } | null;
}) {
  const [word, setWord] = useState(current?.word ?? "");
  const [definition, setDefinition] = useState(current?.definition ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);

    const res = await fetch("/api/admin/word-of-the-day", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, definition }),
    });
    setSaving(false);

    if (!res.ok) {
      setError("Couldn't save — check both fields and try again.");
      return;
    }
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="word" className="mb-1.5 block text-xs font-bold tracking-wide uppercase opacity-60">
          Word
        </label>
        <input
          id="word"
          type="text"
          required
          maxLength={64}
          value={word}
          onChange={(e) => {
            setWord(e.target.value);
            setSaved(false);
          }}
          placeholder="e.g. Sanguine"
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>

      <div>
        <label htmlFor="definition" className="mb-1.5 block text-xs font-bold tracking-wide uppercase opacity-60">
          Definition
        </label>
        <input
          id="definition"
          type="text"
          required
          maxLength={200}
          value={definition}
          onChange={(e) => {
            setDefinition(e.target.value);
            setSaved(false);
          }}
          placeholder="e.g. cheerful and hopeful, even in tough times"
          className="w-full rounded-lg border-2 border-line px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-700">Saved — live on /tools now.</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-lg bg-sky-400 px-6 py-3 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
