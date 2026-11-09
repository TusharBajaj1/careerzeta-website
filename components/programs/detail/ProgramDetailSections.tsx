"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import BrochureButton from "@/components/programs/BrochureButton";
import EnrollButton from "@/components/programs/EnrollButton";
import Reveal from "@/components/ui/Reveal";
import type { ProgramDetailPageData, ProjectLevel } from "@/lib/programDetailPage";

/* Tokens: charcoal gray-900 #111827, aqua sky-400 #38bdf8, deep aqua sky-700 #0369a1, tints sky-100 #e0f2fe and slate-200 #e2e8f0.
 * Grounds alternate white and sky-100. Aqua is the only accent and the only CTA colour. */
const eyebrow = "text-[13px] font-bold tracking-[0.06em] uppercase text-sky-700";
const h2 = "font-display mt-3 text-[clamp(32px,4.2vw,60px)] leading-[1.05] font-semibold tracking-[-0.03em] text-pretty";
const wrap = "mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16";
const btnGhost = "inline-block rounded-full border-2 border-gray-900 px-7 py-3.5 font-bold text-gray-900 transition-transform hover:scale-105";
const pad = (n: number) => String(n + 1).padStart(2, "0");

/* 1. Hero. Breadcrumb + headline + fee card (id="enroll" — the real enroll/admissions actions live here). */
export function ProgramDetailHero({ p }: { p: ProgramDetailPageData }) {
  return (
    <section className="relative overflow-hidden bg-white text-gray-900">
      <Image
        src={p.heroPhoto}
        alt=""
        priority
        sizes="52vw"
        width={1600}
        height={1000}
        className="absolute top-[90px] left-0 h-[230px] w-full object-cover lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[52%]"
      />
      <div
        aria-hidden
        className="absolute inset-0 max-lg:inset-x-0 max-lg:top-[90px] max-lg:bottom-auto max-lg:h-[230px] max-lg:bg-gradient-to-t max-lg:from-white max-lg:to-white/0 bg-gradient-to-r from-white from-[48%] to-white/0 to-[56%]"
      />
      <div className={`${wrap} relative pt-[340px] pb-14 lg:pt-[170px]`}>
        <nav aria-label="Breadcrumb" className="mb-7 flex gap-2.5 text-sm font-bold">
          <Link href="/programs" className="text-sky-700">
            Programs
          </Link>
          <span className="text-slate-500">/</span>
          <span className="text-slate-800">{p.name}</span>
        </nav>
        <div className="grid items-end gap-14 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="font-display text-[clamp(44px,6.6vw,104px)] leading-[0.98] font-semibold tracking-[-0.04em] text-pretty">
              {p.headline.lead}
              <span className="text-sky-700">{p.headline.emphasis}</span>
              {p.headline.trail}
            </h1>
            <p className="mt-7 max-w-[52ch] text-[19px] leading-[1.55] text-slate-800">{p.intro}</p>
            <div className="mt-9 flex flex-wrap gap-3.5">
              <Link href="#enroll" className="inline-block rounded-full bg-sky-400 px-8 py-4 text-lg font-bold text-gray-900 transition-transform hover:scale-105 motion-safe:animate-[cz-pulse-glow_2.4s_infinite]">
                Enroll Now
              </Link>
              {p.brochureUrl && (
                <BrochureButton url={p.brochureUrl} programName={p.name} className={`${btnGhost} text-lg`} />
              )}
            </div>
          </div>
          <aside
            id="enroll"
            className="w-full max-w-[420px] scroll-mt-24 justify-self-end rounded-[28px] border border-slate-300 bg-white p-8 shadow-[0_40px_80px_-40px_rgba(17,24,39,0.35)]"
          >
            <div className="flex flex-wrap gap-2">
              {p.level && (
                <span className="rounded-full bg-gray-900 px-3.5 py-1.5 text-xs font-bold tracking-[0.06em] text-sky-400 uppercase">
                  {p.level}
                </span>
              )}
              {p.duration && (
                <span className="rounded-full bg-sky-100 px-3.5 py-1.5 text-xs font-bold tracking-[0.06em] uppercase">{p.duration}</span>
              )}
            </div>
            <div className="mt-5 text-xs font-bold tracking-[0.06em] text-sky-700 uppercase">Program fee</div>
            <div className="font-display text-[50px] leading-[1.1] font-semibold tracking-[-0.03em]">{p.fee}</div>
            <div className="text-sm text-slate-700">{p.feeNote ?? "Inclusive of all taxes"}</div>
            <EnrollButton
              programSlug={p.slug}
              programName={p.name}
              label="Reserve my seat"
              className="mt-5 block w-full rounded-full bg-gray-900 py-4 text-center font-bold text-white transition-transform hover:scale-[1.03]"
            />
            <Link
              href="/contact"
              className="mt-2.5 block rounded-full border-2 border-gray-900 py-3 text-center font-bold text-gray-900 hover:bg-gray-900/5"
            >
              Talk to admissions
            </Link>
            <div className="mt-3.5 text-center text-[13px] font-bold text-sky-700">Seats fill by cohort</div>
          </aside>
        </div>
        <dl className="mt-16 grid grid-cols-2 border-t border-slate-300 md:grid-cols-5">
          {p.stats.map((s) => (
            <div key={s.label} className="pt-6">
              <dd className="font-display text-[38px] font-semibold tracking-[-0.03em] text-sky-700">{s.value}</dd>
              <dt className="mt-0.5 text-sm text-slate-800">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* 2. Tool ticker (aqua band). Duplicate the list so the loop is seamless. */
export function ToolTicker({ groups }: { groups: ProgramDetailPageData["toolGroups"] }) {
  const tools = groups.flatMap((g) => g.tools);
  return (
    <div className="overflow-hidden bg-sky-400 py-4 text-gray-900" aria-hidden>
      <div className="flex w-max gap-11 font-display text-xl font-semibold whitespace-nowrap motion-safe:animate-[cz-marquee_45s_linear_infinite]">
        {[...tools, ...tools].map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* 3. Why. sky-100 ground, white and aqua cards (every third card aqua, starting at the third). */
export function WhySection({ items }: { items: ProgramDetailPageData["why"] }) {
  return (
    <section id="why" className="scroll-mt-24 bg-sky-100">
      <div className={`${wrap} py-[104px]`}>
        <div className={eyebrow}>Why this program</div>
        <h2 className={`${h2} mb-12 max-w-[18ch]`}>Built for where you want to go next</h2>
        <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
          {items.map((w, i) => {
            const aqua = i % 3 === 2;
            return (
              <Reveal key={w.title}>
                <div
                  className={`flex min-h-[210px] flex-col justify-between gap-6 rounded-[28px] border border-slate-200 p-8 transition-transform hover:-translate-y-1.5 ${aqua ? "bg-sky-400" : "bg-white"}`}
                >
                  <span className={`font-display text-[44px] leading-none font-semibold tracking-[-0.04em] ${aqua ? "text-gray-900" : "text-sky-700"}`}>
                    {pad(i)}
                  </span>
                  <div>
                    <div className="font-display text-[21px] leading-tight font-semibold">{w.title}</div>
                    <p className="mt-2.5 leading-[1.55]">{w.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* 4. Career ladder: rising bars. Fill sequence slate-200, sky-100, sky-400, sky-700, gray-900. */
const LADDER_BG = ["bg-slate-200", "bg-sky-100", "bg-sky-400", "bg-sky-700 text-white", "bg-gray-900 text-white"];
export function CareerLadder({ rungs }: { rungs: string[] }) {
  return (
    <section className="bg-white">
      <div className={`${wrap} overflow-hidden pt-[104px]`}>
        <div className={eyebrow}>A career ladder, not just a job</div>
        <h2 className={`${h2} mb-14 max-w-[20ch]`}>Where the skills take you</h2>
        {/* Below lg the 5-bar grid doesn't fit — snap-scroll it and hint
            there's more with a right-edge fade, instead of letting it cut
            off silently with no sign the Head of Data rung is off-screen. */}
        <div className="relative -mx-6 px-6 md:-mx-10 md:px-10 lg:mx-0 lg:px-0">
          <ol className="grid snap-x snap-mandatory grid-cols-[repeat(5,minmax(130px,1fr))] items-end gap-3 overflow-x-auto scroll-px-6 pb-1 lg:grid-cols-[repeat(5,minmax(150px,1fr))] lg:snap-none lg:overflow-visible">
            {rungs.map((r, i) => (
              <li
                key={r}
                style={{ height: 150 + i * 56 }}
                className={`flex snap-start flex-col justify-between rounded-t-[20px] p-5 ${LADDER_BG[i] ?? LADDER_BG[4]}`}
              >
                <span className="font-display text-sm font-semibold">{pad(i)}</span>
                <span className="font-display text-xl leading-[1.15] font-semibold">{r}</span>
              </li>
            ))}
          </ol>
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 bottom-1 w-14 bg-gradient-to-l from-white to-white/0 lg:hidden"
          />
        </div>
      </div>
    </section>
  );
}

/* 5. Who it's for */
export function AudienceSection({ items }: { items: string[] }) {
  return (
    <section className="bg-sky-100">
      <div className={`${wrap} py-[104px]`}>
        <div className={eyebrow}>Who it&apos;s for</div>
        <h2 className={`${h2} mb-11`}>Is this program right for you?</h2>
        <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((a) => (
            <li
              key={a}
              className="flex min-h-[150px] flex-col justify-between gap-5 rounded-3xl border-2 border-gray-900 bg-white p-[26px] transition-transform hover:-translate-y-2"
            >
              <span aria-hidden className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gray-900 font-bold text-sky-400">
                ✓
              </span>
              <span className="text-[17px] leading-[1.35] font-bold">{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 6. Curriculum: phase list left, detail panel right (sticky). */
export function Curriculum({ p }: { p: ProgramDetailPageData }) {
  const [open, setOpen] = useState(0);
  const cur = p.phases[open];
  const total = p.phases.length;
  return (
    <section id="curriculum" className="scroll-mt-24 bg-white">
      <div className={`${wrap} py-[104px]`}>
        <div className={eyebrow}>Curriculum</div>
        <h2 className={`${h2} mb-11 max-w-[22ch]`}>Phase by phase, from fundamentals to agentic AI</h2>
        <div className="grid items-start gap-7 lg:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            {p.phases.map((ph, i) => (
              <button
                key={ph.name}
                type="button"
                aria-pressed={open === i}
                onClick={() => setOpen(i)}
                className={`flex items-center gap-4 rounded-2xl border px-[18px] py-[15px] text-left ${open === i ? "border-sky-400 bg-sky-400" : "border-slate-300 hover:border-sky-700"}`}
              >
                <span className={`font-display w-[30px] text-lg font-semibold ${open === i ? "text-gray-900" : "text-sky-700"}`}>
                  {pad(i)}
                </span>
                <span className="font-display flex-1 leading-tight font-semibold">{ph.name}</span>
              </button>
            ))}
          </div>
          <div className="rounded-[28px] border border-slate-300 bg-sky-100 p-10 lg:sticky lg:top-8">
            <div className="text-xs font-bold tracking-[0.06em] text-sky-700 uppercase">
              {open === total - 1 && total > 1 ? "Final phase" : `Phase ${open + 1}`} · {cur.modules.length} modules
            </div>
            <h3 className="font-display mt-2.5 mb-6 text-[32px] leading-[1.15] font-semibold tracking-[-0.02em]">{cur.name}</h3>
            <ol>
              {cur.modules.map((m, i) => (
                <li key={m} className="flex gap-4 border-t border-slate-300 py-[15px] text-[17px]">
                  <span className="w-6 font-bold text-sky-700">{pad(i)}</span>
                  {m}
                </li>
              ))}
            </ol>
            <div className="mt-7 flex flex-wrap gap-3">
              <EnrollButton
                programSlug={p.slug}
                programName={p.name}
                className="rounded-full bg-sky-400 px-6 py-3 font-bold text-gray-900 transition-transform hover:scale-105"
              />
              {p.syllabusUrl && (
                <BrochureButton
                  url={p.syllabusUrl}
                  programName={p.name}
                  label="Download syllabus"
                  className="rounded-full border-2 border-gray-900 px-6 py-2.5 font-bold text-gray-900 transition-transform hover:bg-gray-900/5"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 7. Skills and grouped tools. */
export function SkillsAndTools({ p }: { p: ProgramDetailPageData }) {
  return (
    <section id="tools" className="scroll-mt-24 bg-sky-100">
      <div className={`${wrap} py-[104px]`}>
        <div className={eyebrow}>Skills you&apos;ll master</div>
        <h2 className={`${h2} mb-7 max-w-[20ch]`}>What you&apos;ll walk away able to do</h2>
        <ul className="flex flex-wrap gap-2.5">
          {p.skills.map((s) => (
            <li key={s} className="rounded-full bg-white px-5 py-[11px] font-bold">
              {s}
            </li>
          ))}
        </ul>
        <h3 className="font-display mt-[72px] mb-6 text-3xl font-semibold tracking-[-0.02em]">The real tools of the trade</h3>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {p.toolGroups.map((g) => (
            <div key={g.name} className="rounded-3xl bg-white p-[26px]">
              <div className="mb-3.5 text-xs font-bold tracking-[0.06em] text-sky-700 uppercase">{g.name}</div>
              <ul className="flex flex-wrap gap-2">
                {g.tools.map((t) => (
                  <li key={t} className="rounded-full border border-sky-400 px-3 py-1.5 text-sm font-medium">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 8. Projects with level filter. Level bars: Beginner 1 aqua, Intermediate 2, Advanced 3 (rest slate-600). */
const LEVELS: ProjectLevel[] = ["Beginner", "Intermediate", "Advanced"];
export function Projects({ items }: { items: ProgramDetailPageData["projects"] }) {
  const [f, setF] = useState<"All" | ProjectLevel>("All");
  const list = items.map((x, i) => ({ ...x, n: pad(i) })).filter((x) => f === "All" || x.level === f);
  return (
    <section id="projects" className="scroll-mt-24 bg-white">
      <div className={`${wrap} py-[104px]`}>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className={eyebrow}>Course projects</div>
            <h2 className={h2}>Build a portfolio as you go</h2>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by level">
            {(["All", ...LEVELS] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={f === l}
                onClick={() => setF(l)}
                className={`rounded-full border-2 border-sky-400 px-[18px] py-[9px] text-sm font-bold text-gray-900 ${f === l ? "bg-sky-400" : ""}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((x) => {
            const k = LEVELS.indexOf(x.level) + 1;
            return (
              <article key={x.title} className="flex flex-col gap-3 rounded-[26px] border border-sky-100 bg-sky-100 p-7 hover:border-sky-700">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[40px] leading-none font-semibold tracking-[-0.04em] text-sky-700">{x.n}</span>
                  <span className="flex items-center gap-2">
                    <span className="flex gap-1" aria-hidden>
                      {[1, 2, 3].map((b) => (
                        <span key={b} className={`h-5 w-2 rounded ${b <= k ? "bg-sky-400" : "bg-slate-600"}`} />
                      ))}
                    </span>
                    <span className="text-xs font-bold tracking-[0.06em] text-slate-800 uppercase">{x.level}</span>
                  </span>
                </div>
                <h3 className="font-display text-xl leading-tight font-semibold">{x.title}</h3>
                <p className="text-[15px] leading-[1.55] text-slate-800">{x.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* 9. Capstone (sky-100 ground, charcoal rules) */
export function Capstone({ items }: { items: string[] }) {
  return (
    <section className="bg-sky-100 text-gray-900">
      <div className={`${wrap} grid items-start gap-14 py-24 lg:grid-cols-2`}>
        <div>
          <div className="text-[13px] font-bold tracking-[0.06em] uppercase">Capstone &amp; portfolio</div>
          <h2 className={h2}>A capstone that proves you can do the job</h2>
        </div>
        <ol>
          {items.map((c, i) => (
            <li key={c} className="flex items-center gap-[18px] border-t-2 border-gray-900 py-4 text-lg font-bold">
              <span className="font-display w-[26px] text-sm">{pad(i)}</span>
              {c}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 10. Case studies as industry tabs */
export function CaseStudies({ items }: { items: ProgramDetailPageData["caseStudies"] }) {
  const [i, setI] = useState(0);
  const c = items[i];
  return (
    <section id="cases" className="scroll-mt-24 bg-white">
      <div className={`${wrap} py-[104px]`}>
        <div className={eyebrow}>Industry case studies</div>
        <h2 className={`${h2} mb-10`}>Real problems, across real industries</h2>
        <div role="tablist" className="mb-6 flex flex-wrap gap-2">
          {items.map((x, k) => (
            <button
              key={x.industry}
              role="tab"
              aria-selected={i === k}
              onClick={() => setI(k)}
              className={`rounded-full border-2 border-sky-400 px-5 py-2.5 font-bold text-gray-900 ${i === k ? "bg-sky-400" : ""}`}
            >
              {x.industry}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="grid items-center gap-8 rounded-[32px] border border-slate-300 bg-sky-100 p-12 md:grid-cols-2">
          <div className="font-display text-[clamp(28px,3.4vw,46px)] leading-[1.1] font-semibold tracking-[-0.03em]">{c.title}</div>
          <p className="text-[19px] leading-[1.6] text-slate-800">{c.text}</p>
        </div>
      </div>
    </section>
  );
}

/* 11. Career services */
export function CareerServices({ items }: { items: string[] }) {
  return (
    <section id="careers" className="scroll-mt-24 bg-sky-100">
      <div className={`${wrap} py-[104px]`}>
        <div className={eyebrow}>Career services</div>
        <h2 className={`${h2} mb-11`}>What we offer beyond the classroom</h2>
        <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t, i) => (
            <li key={t} className="flex flex-col gap-4 rounded-[22px] border border-slate-200 bg-white p-[26px]">
              <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-sky-400 font-bold">{i + 1}</span>
              <span className="leading-normal font-medium">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 12. How to join + closing CTA. Step 1 node is aqua, others white. Closing band is sky-100 with a charcoal fee card. */
export function JoinAndCta({ p }: { p: ProgramDetailPageData }) {
  return (
    <section id="join" className="scroll-mt-24 bg-white">
      <div className={`${wrap} pt-[104px] pb-12`}>
        <div className={eyebrow}>How to join</div>
        <h2 className={h2}>Four steps to your first class</h2>
        <p className="mt-3.5 mb-[52px] text-lg text-slate-800">From a quick conversation with our team to your first live session.</p>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {p.steps.map((s, i) => (
            <li key={s.title}>
              <div className="mb-[18px] flex items-center">
                <span
                  className={`flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full border-2 border-sky-400 font-bold ${i === 0 ? "bg-sky-400" : "bg-white"}`}
                >
                  {pad(i)}
                </span>
                {i < p.steps.length - 1 && <span aria-hidden className="h-[3px] flex-1 rounded bg-sky-400" />}
              </div>
              <div className="font-display text-xl leading-[1.3] font-semibold">{s.title}</div>
              <p className="mt-2 pr-3 text-[15px] leading-[1.55] text-slate-800">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className={`${wrap} pt-12 pb-32`}>
        <div className="grid items-center gap-9 rounded-[40px] bg-sky-100 p-8 text-gray-900 md:p-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[clamp(34px,4.6vw,66px)] leading-none font-semibold tracking-[-0.04em] text-pretty">
              Ready to start {p.name}?
            </h2>
            <p className="mt-4 max-w-[44ch] text-[19px] leading-normal font-medium">
              Seats fill by cohort — talk to our team or pay your fee to lock in your batch.
            </p>
          </div>
          <div className="rounded-[28px] bg-gray-900 p-[30px] text-white">
            <div className="text-xs font-bold tracking-[0.06em] text-sky-400 uppercase">Program fee · incl. taxes</div>
            <div className="font-display mt-1 mb-5 text-[44px] font-semibold tracking-[-0.03em]">{p.fee}</div>
            <EnrollButton
              programSlug={p.slug}
              programName={p.name}
              className="block w-full rounded-full bg-sky-400 py-4 text-center font-bold text-gray-900 transition-transform hover:scale-[1.03]"
            />
            {p.brochureUrl && (
              <BrochureButton
                url={p.brochureUrl}
                programName={p.name}
                className="mt-2.5 block w-full rounded-full border-2 border-white/60 py-3 text-center font-bold text-white transition-transform hover:bg-white/10"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 13. Floating CTA pill, fixed bottom centre on every scroll position. */
export function FloatingEnroll({ p }: { p: ProgramDetailPageData }) {
  return (
    <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full border border-sky-400/60 bg-white/95 p-2 shadow-[0_20px_50px_-10px_rgba(17,24,39,0.45)] backdrop-blur">
      <EnrollButton
        programSlug={p.slug}
        programName={p.name}
        className="rounded-full bg-sky-400 px-[26px] py-[13px] text-[15px] font-bold whitespace-nowrap text-gray-900 transition-transform hover:scale-105"
      />
    </div>
  );
}
