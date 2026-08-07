import type { LucideIcon } from "lucide-react";

type MediaPlaceholderProps = {
  icon: LucideIcon;
  label: string;
  className?: string;
  tone?: "light" | "dark";
};

/**
 * Stand-in for photography that hasn't been shot yet. Deliberately styled as a
 * finished surface rather than a broken-image box, so the page reads as
 * complete until real assets drop in.
 */
export default function MediaPlaceholder({
  icon: Icon,
  label,
  className = "",
  tone = "light",
}: MediaPlaceholderProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-3 overflow-hidden px-6 text-center ${
        isDark
          ? "bg-gradient-to-br from-slate-900 to-gray-900"
          : "bg-gradient-to-br from-sky-50 to-slate-100"
      } ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: `radial-gradient(circle at 1.5px 1.5px, ${
            isDark ? "rgba(255,255,255,0.14)" : "rgb(203 213 225)"
          } 1.5px, transparent 0)`,
          backgroundSize: "22px 22px",
        }}
      />

      <span
        className={`relative flex h-12 w-12 items-center justify-center rounded-full ${
          isDark ? "bg-white/10 text-sky-300" : "bg-white text-sky-600"
        } shadow-sm`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>

      <span
        className={`relative max-w-[34ch] text-sm leading-relaxed ${
          isDark ? "text-white/70" : "text-slate-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
