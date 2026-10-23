"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  if (pathname === "/admin/login") return null;

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      // Full navigation (not router.refresh) guarantees the cleared
      // session cookie is in effect before the proxy re-checks it on the
      // next request — same reasoning as the login page's redirect.
      window.location.href = "/admin/login";
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-line px-6 py-4">
      <Link href="/admin" className="font-display text-base font-bold">
        CareerZeta Admin
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="rounded-lg border-2 border-line px-4 py-2 text-sm font-semibold transition hover:border-red-400 hover:text-red-600 disabled:opacity-60"
      >
        {loggingOut ? "Logging out…" : "Log out"}
      </button>
    </div>
  );
}
