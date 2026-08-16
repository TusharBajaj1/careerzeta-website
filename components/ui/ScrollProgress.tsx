"use client";

import { useEffect, useState } from "react";

/** Thin accent bar pinned to the top of the viewport tracking scroll depth. */
export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-50 h-[3px] bg-sky-400 transition-[width] duration-100 ease-linear"
      style={{ width: `${pct}%` }}
    />
  );
}
