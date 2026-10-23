"use client";

import { Suspense, useState, type FormEvent } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const LOGIN_TIMEOUT_MS = 15000;

/** Only an internal path is safe to redirect to — rejects absolute/protocol-relative URLs an attacker could put in ?next= to phish post-login. */
function safeNextPath(next: string | null): string {
  if (next && /^\/(?!\/)/.test(next)) return next;
  return "/admin";
}

function LoginForm() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), LOGIN_TIMEOUT_MS);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      });

      if (!res.ok) {
        setError("Incorrect username or password.");
        setSubmitting(false);
        return;
      }

      // A full navigation (not router.replace/refresh) guarantees the
      // browser sends the just-set session cookie on a fresh request to
      // the proxy-gated route — avoids the client router getting stuck
      // mid-transition, which showed up as the login page hanging.
      window.location.href = safeNextPath(searchParams.get("next"));
    } catch (err) {
      setError(
        err instanceof DOMException && err.name === "AbortError"
          ? "That took too long — please try again."
          : "Something went wrong — please try again.",
      );
      setSubmitting(false);
    } finally {
      clearTimeout(timeout);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b1220] px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.12),transparent_55%)]"
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#111c33] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
      >
        <div className="flex flex-col items-center text-center">
          <Image
            src="/brand/careerzeta-mark-white.png"
            alt="CareerZeta"
            width={632}
            height={544}
            className="h-12 w-auto"
          />
          <h1 className="mt-5 font-display text-2xl font-bold text-white">Admin Login</h1>
          <p className="mt-1 text-sm text-white/60">CareerZeta internal tools</p>
        </div>

        <div className="mt-7 flex flex-col gap-4">
          <input
            name="username"
            type="text"
            aria-label="Username"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
          />
          <input
            name="password"
            type="password"
            aria-label="Password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-lg bg-sky-400 px-7 py-3 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
