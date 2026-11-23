import { FileText } from "lucide-react";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";

import Reveal from "@/components/ui/Reveal";

/**
 * Each card below deliberately breaks from the site's own design system —
 * it borrows the visual language of the tool it links to (colors,
 * typography mood, the kind of chip/badge that site actually uses) rather
 * than forcing everything into CareerZeta's own card style. The Resume
 * Builder is CareerZeta's own tool, so its card uses the site's own brand
 * language instead of borrowing someone else's.
 */

function PdfRookieCard() {
  return (
    <a
      href="https://www.pdfrookie.org/"
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col rounded-2xl border-[3px] border-black bg-[#FAF6EE] p-7 text-[#1c1814] shadow-[6px_6px_0_0_#111827] transition-transform duration-150 hover:-translate-y-1 hover:shadow-[8px_10px_0_0_#111827]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-[#F15A29] text-white">
          <FileText className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div className="inline-flex rounded-full border-2 border-[#F15A29] px-3 py-1 text-[11px] font-bold tracking-[0.04em] text-[#F15A29] uppercase">
          100% Free · No Signup
        </div>
      </div>

      <h3 className="mt-5 font-serif text-[28px] leading-[1.1] font-black tracking-tight">
        Document tools that{" "}
        <span className="bg-[#FFD93D] px-1">stay free.</span>
      </h3>
      <p className="mt-3 text-[15px] leading-normal text-[#44403c]">
        Merge, split, rotate, convert and OCR your PDFs — 17 tools, no email required.
      </p>

      <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg border-2 border-black bg-[#F15A29] px-5 py-2.5 text-sm font-bold text-white transition-transform duration-150 group-hover:scale-105">
        Visit PDFRookie →
      </div>
    </a>
  );
}

/** Recreates @w.o.r.dd's own profile-picture lockup rather than a sample word — static, so it never looks stale or needs updating. */
function WordCard() {
  return (
    <a
      href="https://www.instagram.com/w.o.r.dd/"
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col justify-between overflow-hidden rounded-2xl p-7 text-white transition-transform duration-150 hover:-translate-y-1"
      style={{
        backgroundImage: "linear-gradient(135deg, #7c3aed 0%, #c026d3 55%, #f97316 100%)",
      }}
    >
      <div className="flex items-center gap-2 text-[13px] font-bold tracking-[0.04em] uppercase opacity-90">
        <FaInstagram className="h-4 w-4" />
        @w.o.r.dd
      </div>

      <div className="mt-9">
        <div className="font-display text-[34px] leading-[0.95] font-bold tracking-tight">
          W.o.r.dd
        </div>
        <div className="mt-3 font-display text-xl leading-tight font-bold">
          /
          <br />
          World of Words
        </div>
      </div>

      <div className="mt-8 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur-sm transition-transform duration-150 group-hover:scale-105">
        Follow along →
      </div>
    </a>
  );
}

/** CareerZeta's own tool — unlike the other two cards, this borrows the site's own brand language (sky-400 accent) rather than someone else's. */
function ResumeBuilderCard() {
  return (
    <a
      href="https://resumebuilder-beta-lemon.vercel.app/"
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col justify-between rounded-2xl border-2 border-line bg-slate-50 p-7 text-slate-900 transition-transform duration-150 hover:-translate-y-1 hover:border-sky-400"
    >
      <div>
        <div className="relative mb-6 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-white">
          <Image
            src="/tools/resume-builder-preview.png"
            alt="Before and after resume preview from the Resume Builder"
            width={989}
            height={1008}
            className="h-full w-auto object-contain transition-transform duration-150 group-hover:scale-105"
          />
        </div>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-[11px] font-bold tracking-wide text-sky-700 uppercase">
          Beta
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">Resume Builder</h3>
        <p className="mt-3 text-[15px] leading-normal opacity-70">
          A free resume builder for students — pick a template, fill it in, export a clean PDF.
        </p>
      </div>
      <div className="mt-8 inline-flex w-fit items-center gap-2 rounded-lg bg-sky-400 px-5 py-2.5 text-sm font-bold text-slate-900 transition-transform duration-150 group-hover:scale-105">
        Try Resume Builder →
      </div>
    </a>
  );
}

function MoreToolsCard() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border-2 border-dashed border-line bg-white/60 p-7 text-slate-500">
      <div>
        <span className="rounded-full bg-slate-200 px-3 py-1 text-[11px] font-bold tracking-wide text-slate-600 uppercase">
          Coming soon
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-slate-700">More Tools</h3>
        <p className="mt-3 text-[15px] leading-normal">
          We&apos;re adding more free tools for students here over time — check back soon.
        </p>
      </div>
      <p className="mt-8 text-xs font-semibold tracking-wide uppercase opacity-60">In the works — check back soon</p>
    </div>
  );
}

export default function ToolsGrid() {
  return (
    <section className="bg-white">
      <Reveal className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-16 lg:py-[110px]">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PdfRookieCard />
          <WordCard />
          <ResumeBuilderCard />
          <MoreToolsCard />
        </div>
      </Reveal>
    </section>
  );
}
