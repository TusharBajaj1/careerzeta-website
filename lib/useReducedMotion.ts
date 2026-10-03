"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
const getSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerSnapshot = () => false;

/** Tracks the prefers-reduced-motion media query without the setState-in-effect anti-pattern. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
