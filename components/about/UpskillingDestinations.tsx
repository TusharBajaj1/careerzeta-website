import { Building2 } from "lucide-react";

import Reveal from "@/components/ui/Reveal";

export type CompanyLogo = {
  name: string;
  logoUrl: string;
};

/** No logos have been supplied yet — populate and this renders the grid. */
const companies: CompanyLogo[] = [];

export default function UpskillingDestinations() {
  return (
    <Reveal
      id="upskilling"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-20 md:px-10 lg:px-16 lg:py-28"
    >
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        Where can upskilling take you?
      </h6>
      <h2 className="mt-3.5 max-w-[32ch] font-display text-4xl font-bold">
        Skills relevant across the organisations shaping data and AI
      </h2>
      <p className="mt-4 max-w-[70ch] text-base opacity-60 italic">
        These are examples of organisations where the skills built through
        CareerZeta are relevant — not partners, recruiters or an endorsement,
        and not a placement guarantee.
      </p>

      {companies.length > 0 ? (
        <div className="mt-11 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-6">
          {companies.map((company) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={company.name}
              src={company.logoUrl}
              alt={company.name}
              className="h-10 w-full object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
            />
          ))}
        </div>
      ) : (
        <div className="mt-11 flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-line px-6 py-14 text-center">
          <Building2
            className="h-8 w-8 text-slate-400"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-sm text-slate-500">
            Company logos coming soon.
          </p>
        </div>
      )}
    </Reveal>
  );
}
