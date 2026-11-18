import type { CSSProperties } from "react";

import Reveal from "@/components/ui/Reveal";

export type CompanyLogo = {
  name: string;
  slug: string;
};

/** Sourced from the client's own program brochures ("Top Destinations"). Split across two rows that scroll in opposite directions. */
const ROW_1: CompanyLogo[] = [
  { name: "Amazon", slug: "amazon" },
  { name: "Microsoft", slug: "microsoft" },
  { name: "Accenture", slug: "accenture" },
  { name: "HDFC Bank", slug: "hdfc-bank" },
  { name: "Infosys", slug: "infosys" },
  { name: "Razorpay", slug: "razorpay" },
  { name: "Swiggy", slug: "swiggy" },
  { name: "KPMG", slug: "kpmg" },
  { name: "Citi", slug: "citi" },
  { name: "Wipro", slug: "wipro" },
  { name: "Target", slug: "target" },
  { name: "Meesho", slug: "meesho" },
  { name: "CRED", slug: "cred" },
  { name: "Ola", slug: "ola" },
];

const ROW_2: CompanyLogo[] = [
  { name: "Zomato", slug: "zomato" },
  { name: "Uber", slug: "uber" },
  { name: "Cognizant", slug: "cognizant" },
  { name: "HSBC", slug: "hsbc" },
  { name: "Tata Steel", slug: "tata-steel" },
  { name: "Novartis", slug: "novartis" },
  { name: "JPMorgan Chase & Co.", slug: "jpmorgan-chase" },
  { name: "Genpact", slug: "genpact" },
  { name: "Groww", slug: "groww" },
  { name: "Capgemini", slug: "capgemini" },
  { name: "PwC", slug: "pwc" },
  { name: "Tech Mahindra", slug: "tech-mahindra" },
  { name: "Paytm", slug: "paytm" },
];

function LogoTile({ company }: { company: CompanyLogo }) {
  return (
    <div className="flex h-[88px] w-[160px] shrink-0 items-center justify-center rounded-2xl border-2 border-line bg-white p-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/companies/${company.slug}.png`} alt={company.name} className="max-h-full w-auto object-contain" />
    </div>
  );
}

function MarqueeRow({ logos, reverse, durationS }: { logos: CompanyLogo[]; reverse?: boolean; durationS: number }) {
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div
        className={`flex w-max gap-4 ${reverse ? "animate-[cz-marquee_var(--d)_linear_infinite_reverse]" : "animate-[cz-marquee_var(--d)_linear_infinite]"} hover:[animation-play-state:paused]`}
        style={{ "--d": `${durationS}s` } as CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-4 pr-4">
            {logos.map((company) => (
              <LogoTile key={`${copy}-${company.slug}`} company={company} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Organisations() {
  return (
    <Reveal id="upskilling" className="scroll-mt-24 bg-sky-100 py-14 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Where can upskilling take you?
        </h6>
        <h2 className="mt-3.5 max-w-[32ch] font-display text-4xl font-bold">
          Skills relevant across the organisations shaping data and AI
        </h2>
      </div>

      <div className="mt-11 flex flex-col gap-4">
        <MarqueeRow logos={ROW_1} durationS={32} />
        <MarqueeRow logos={ROW_2} reverse durationS={28} />
      </div>
    </Reveal>
  );
}
