"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type FloatingBubbleProps = {
  children: ReactNode;
  className?: string;
  tabIndex?: number;
  /** Max px distance a step can land at from the resting position. */
  rangeX?: number;
  rangeY?: number;
  /** Each re-target fires at a random moment in this window (ms) — an irregular cadence, not a fixed loop. */
  minIntervalMs?: number;
  maxIntervalMs?: number;
};

/**
 * Drives a continuous, never-repeating random walk: a fresh random target
 * picked at a random moment, every time, like a particle getting knocked
 * onto a new heading rather than looping a fixed path. Pauses while
 * hovered/focused so the hover-enlarge interaction stays put.
 */
export default function FloatingBubble({
  children,
  className,
  tabIndex,
  rangeX = 16,
  rangeY = 24,
  minIntervalMs = 700,
  maxIntervalMs = 1900,
}: FloatingBubbleProps) {
  const [pos, setPos] = useState({ x: 0, y: 0, duration: 1 });
  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const step = () => {
      const interval = minIntervalMs + Math.random() * (maxIntervalMs - minIntervalMs);
      if (!pausedRef.current) {
        setPos({
          x: (Math.random() * 2 - 1) * rangeX,
          y: (Math.random() * 2 - 1) * rangeY,
          duration: interval / 1000,
        });
      }
      timerRef.current = setTimeout(step, interval);
    };

    timerRef.current = setTimeout(step, Math.random() * maxIntervalMs);
    return () => clearTimeout(timerRef.current);
  }, [rangeX, rangeY, minIntervalMs, maxIntervalMs]);

  return (
    <div
      className={className}
      tabIndex={tabIndex}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocus={() => {
        pausedRef.current = true;
      }}
      onBlur={() => {
        pausedRef.current = false;
      }}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: `transform ${pos.duration}s ease-out`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
