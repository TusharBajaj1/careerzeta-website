"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const mobile = String(form.get("mobile") ?? "").trim();

    if (!name || !email || !mobile) {
      setError("Please fill in every field.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("That email address doesn't look right.");
      return;
    }
    if (mobile.replace(/\D/g, "").length < 8) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(
          "We couldn't complete your subscription right now — please try again shortly, or email us directly at hello@careerzeta.com.",
        );
      }
    } catch {
      setStatus("error");
      setError(
        "We couldn't complete your subscription right now — please try again shortly, or email us directly at hello@careerzeta.com.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-sky-100 px-5 py-4 text-sky-800">
        <Mail className="h-5 w-5 shrink-0" aria-hidden />
        <span className="text-sm font-semibold">
          Thanks — you&apos;re on the list.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <input
          name="name"
          type="text"
          placeholder="Name"
          required
          className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
        <input
          name="mobile"
          type="tel"
          placeholder="Mobile Number"
          required
          className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-fit rounded-lg bg-sky-400 px-7 py-3 text-sm font-bold whitespace-nowrap text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60"
      >
        {status === "submitting" ? "Subscribing…" : "Subscribe"}
      </button>

      <p className="max-w-[60ch] text-xs opacity-50">
        By subscribing you agree to receive occasional emails from
        CareerZeta. Unsubscribe anytime.
      </p>
    </form>
  );
}
