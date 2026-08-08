"use client";

import { motion } from "framer-motion";
import { BarChart3, Bot, Sparkles, TrendingUp } from "lucide-react";

/**
 * Original illustration replacing the old hero photo placeholder: an
 * ascending line through the skill areas CareerZeta teaches, ending in
 * career growth. All coordinates share one 0-100 space so the SVG path
 * (viewBox 0 0 100 100, non-uniform scaling) lines up with the
 * percentage-positioned nodes regardless of the container's aspect ratio.
 */
const nodes = [
  { icon: BarChart3, label: "Data Analytics", top: 80, left: 12 },
  { icon: Sparkles, label: "Applied AI", top: 56, left: 36 },
  { icon: Bot, label: "Agentic AI", top: 32, left: 60 },
  { icon: TrendingUp, label: "Career growth", top: 12, left: 84 },
];

export default function HeroIllustration() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1.5px 1.5px, rgb(203 213 225) 1.5px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M12 80 C 24 70, 30 60, 36 56 S 52 36, 60 32 S 76 16, 84 12"
          stroke="url(#cz-hero-ascent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <defs>
          <linearGradient
            id="cz-hero-ascent"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="100"
            x2="100"
            y2="0"
          >
            <stop offset="0" stopColor="#111827" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>

      {nodes.map((node, i) => (
        <motion.div
          key={node.label}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
          style={{ top: `${node.top}%`, left: `${node.left}%` }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sky-700 shadow-md ring-1 ring-slate-900/5">
            <node.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-slate-700 shadow-sm">
            {node.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
