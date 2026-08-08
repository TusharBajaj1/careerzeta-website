"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

/** Fades out once the visitor starts scrolling — a hint, not a fixture. */
export default function ScrollCue() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 bottom-6 z-30 flex flex-col items-center gap-1 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="text-xs font-semibold tracking-[0.06em] text-slate-500 uppercase">
        Scroll to explore
      </span>
      <ChevronDown className="h-5 w-5 animate-bounce text-sky-500" />
    </div>
  );
}
