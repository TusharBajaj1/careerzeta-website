"use client";

import { useState } from "react";

export type BlogSeriesRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
};

function SeriesForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial?: BlogSeriesRow;
  onCancel: () => void;
  onSaved: (series: BlogSeriesRow) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      setError("Give the series a name.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const res = await fetch(initial ? `/api/admin/blog-series/${initial.id}` : "/api/admin/blog-series", {
      method: initial ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
    });

    if (!res.ok) {
      setError("Something went wrong saving this series — please try again.");
      setSubmitting(false);
      return;
    }

    const data = await res.json();
    onSaved({ ...data.series, postCount: data.series.postCount ?? initial?.postCount ?? 0 });
  }

  return (
    <div className="mt-4 rounded-lg border-2 border-line bg-slate-50 p-4">
      <div className="flex flex-col gap-3">
        <div>
          <label htmlFor="series-name" className="mb-1 block text-sm font-semibold">
            Series name
          </label>
          <input
            id="series-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. AI at Work"
            className="w-full rounded-lg border-2 border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-sky-400"
          />
        </div>
        <div>
          <label htmlFor="series-description" className="mb-1 block text-sm font-semibold">
            Description <span className="text-xs font-normal opacity-60">(shown to readers)</span>
          </label>
          <textarea
            id="series-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="What this series is about…"
            className="w-full rounded-lg border-2 border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-sky-400"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={submitting}
            className="rounded-lg bg-sky-400 px-4 py-2 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Save"}
          </button>
          <button type="button" onClick={onCancel} className="text-sm font-semibold opacity-70 hover:underline">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BlogSeriesClient({ initialSeries }: { initialSeries: BlogSeriesRow[] }) {
  const [series, setSeries] = useState<BlogSeriesRow[]>(initialSeries);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function handleDelete(s: BlogSeriesRow) {
    const message =
      s.postCount > 0
        ? `Delete "${s.name}"? Its ${s.postCount} post${s.postCount === 1 ? "" : "s"} will stay, just no longer be in a series.`
        : `Delete "${s.name}"?`;
    if (!confirm(message)) return;

    const res = await fetch(`/api/admin/blog-series/${s.id}`, { method: "DELETE" });
    if (res.ok) setSeries((prev) => prev.filter((row) => row.id !== s.id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Series</h1>
        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-lg bg-sky-400 px-5 py-3 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105"
          >
            + New Series
          </button>
        )}
      </div>

      {creating && (
        <SeriesForm
          onCancel={() => setCreating(false)}
          onSaved={(s) => {
            setSeries((prev) => [...prev, s]);
            setCreating(false);
          }}
        />
      )}

      <div className="mt-6 flex flex-col gap-3">
        {series.length === 0 && !creating ? (
          <p className="text-sm opacity-60">
            No series yet — register one to start grouping your weekly posts together.
          </p>
        ) : null}

        {series.map((s) =>
          editingId === s.id ? (
            <SeriesForm
              key={s.id}
              initial={s}
              onCancel={() => setEditingId(null)}
              onSaved={(updated) => {
                setSeries((prev) => prev.map((row) => (row.id === s.id ? updated : row)));
                setEditingId(null);
              }}
            />
          ) : (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-lg border-2 border-line bg-white px-4 py-3"
            >
              <div>
                <div className="font-semibold">
                  {s.name} <span className="font-normal opacity-50">· {s.postCount} post{s.postCount === 1 ? "" : "s"}</span>
                </div>
                {s.description ? <p className="mt-1 text-sm opacity-70">{s.description}</p> : null}
              </div>
              <div className="flex shrink-0 gap-3 pl-4">
                <button onClick={() => setEditingId(s.id)} className="text-sm text-sky-700 hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(s)} className="text-sm text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
