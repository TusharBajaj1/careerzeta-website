"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";

import { PROGRAMS } from "@/lib/content";
import {
  FORM_NOT_CONFIGURED_MESSAGE,
  isValidEmail,
  isValidMobile,
} from "@/lib/forms";

type Status = "idle" | "submitting" | "success" | "error";

const interestOptions = [...PROGRAMS.map((p) => p.name), "General Enquiry"];

export default function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const mobile = String(form.get("mobile") ?? "").trim();
    const interest = String(form.get("interest") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!name || !email || !mobile || !interest || !message) {
      setError("Please fill in every field.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("That email address doesn't look right.");
      return;
    }
    if (!isValidMobile(mobile)) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile, interest, message }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(FORM_NOT_CONFIGURED_MESSAGE);
      }
    } catch {
      setStatus("error");
      setError(FORM_NOT_CONFIGURED_MESSAGE);
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-sky-100 px-5 py-4 text-sky-800">
        <Mail className="h-5 w-5 shrink-0" aria-hidden />
        <span className="text-sm font-semibold">
          Thanks for getting in touch. We&apos;ll get back to you soon.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="mobile"
          type="tel"
          placeholder="Mobile Number"
          required
          className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
        <select
          name="interest"
          required
          defaultValue=""
          className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
        >
          <option value="" disabled>
            What are you interested in?
          </option>
          {interestOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <textarea
        name="message"
        placeholder="Message"
        required
        rows={4}
        className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-fit rounded-lg bg-sky-400 px-7 py-3 text-sm font-bold whitespace-nowrap text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Submit Enquiry"}
      </button>
    </form>
  );
}
