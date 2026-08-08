"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Mail, Upload } from "lucide-react";

import {
  FORM_NOT_CONFIGURED_MESSAGE,
  isValidEmail,
  isValidMobile,
  validateCvFile,
} from "@/lib/forms";

type Status = "idle" | "submitting" | "success" | "error";

const interestOptions = [
  "Becoming a Mentor",
  "Joining CareerZeta",
  "Both",
] as const;

export default function WorkWithUsForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  function handleCvChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setCvFile(null);
      return;
    }
    const cvError = validateCvFile(file);
    if (cvError) {
      setError(cvError);
      e.target.value = "";
      setCvFile(null);
      return;
    }
    setError(null);
    setCvFile(file);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const interest = String(form.get("interest") ?? "").trim();
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const mobile = String(form.get("mobile") ?? "").trim();

    if (!interest || !name || !email || !mobile) {
      setError("Please fill in every required field.");
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
      const res = await fetch("/api/work-with-us", {
        method: "POST",
        body: form,
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
          Thanks for your interest in working with CareerZeta. We&apos;ve
          received your details and will be in touch if there&apos;s a
          relevant opportunity.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <p className="mb-2.5 text-xs font-bold tracking-[0.06em] uppercase opacity-50">
          I&apos;m interested in:
        </p>
        <div className="flex flex-wrap gap-3">
          {interestOptions.map((option, i) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-line px-4 py-2.5 text-sm font-semibold has-checked:border-sky-400 has-checked:bg-sky-50"
            >
              <input
                type="radio"
                name="interest"
                value={option}
                required
                defaultChecked={i === 0}
                className="accent-sky-500"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

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
        <input
          name="linkedin"
          type="url"
          placeholder="LinkedIn Profile (optional)"
          className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-line px-4 py-3.5 text-sm font-semibold text-slate-600 transition hover:border-sky-300">
        <Upload className="h-4 w-4 shrink-0" aria-hidden />
        {cvFile ? cvFile.name : "Upload CV (PDF or Word, optional)"}
        <input
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleCvChange}
          className="hidden"
        />
      </label>

      <textarea
        name="about"
        placeholder="Tell us a little about yourself (optional)"
        rows={4}
        className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs opacity-50">
        By submitting, you agree to CareerZeta contacting you about this
        enquiry.
      </p>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-fit rounded-lg bg-sky-400 px-7 py-3 text-sm font-bold whitespace-nowrap text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
