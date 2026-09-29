"use client";

import { useState } from "react";

import Reveal from "@/components/ui/Reveal";

export type CompanyLogo = {
  name: string;
  slug: string;
};

/** Sourced from the client's own program brochures ("Top Destinations"). */
const FEATURED: CompanyLogo[] = [
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
];

const REST: CompanyLogo[] = [
  { name: "Target", slug: "target" },
  { name: "Meesho", slug: "meesho" },
  { name: "CRED", slug: "cred" },
  { name: "Ola", slug: "ola" },
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

export default function Organisations() {
  const [showAll, setShowAll] = useState(false);
  const logos = showAll ? [...FEATURED, ...REST] : FEATURED;

  return (
    <Reveal
      id="upskilling"
      className="scroll-mt-24 bg-sky-100 px-6 py-14 md:px-10 lg:px-16 lg:py-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Where can upskilling take you?
        </h6>
        <h2 className="mt-3.5 max-w-[32ch] font-display text-4xl font-bold">
          Skills relevant across the organisations shaping data and AI
        </h2>

        <div className="mt-11 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
          {logos.map((company) => (
            <div
              key={company.slug}
              className="flex h-[88px] items-center justify-center rounded-2xl border-2 border-line bg-white p-5 transition-transform duration-150 hover:scale-[1.04]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/companies/${company.slug}.png`}
                alt={company.name}
                className="max-h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-8 cursor-pointer text-sm font-bold text-sky-700 underline decoration-sky-300 underline-offset-4 transition hover:text-sky-800"
        >
          {showAll ? "Show fewer" : "View more"}
        </button>
      </div>
    </Reveal>
  );
}
