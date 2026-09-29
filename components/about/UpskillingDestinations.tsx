import Reveal from "@/components/ui/Reveal";

export type CompanyLogo = {
  name: string;
  logoUrl: string;
};

/** Sourced from the client's own program brochures ("Top Destinations"). */
const companies: CompanyLogo[] = [
  { name: "Amazon", logoUrl: "/companies/amazon.png" },
  { name: "Target", logoUrl: "/companies/target.png" },
  { name: "Meesho", logoUrl: "/companies/meesho.png" },
  { name: "CRED", logoUrl: "/companies/cred.png" },
  { name: "Ola", logoUrl: "/companies/ola.png" },
  { name: "HDFC Bank", logoUrl: "/companies/hdfc-bank.png" },
  { name: "Zomato", logoUrl: "/companies/zomato.png" },
  { name: "Accenture", logoUrl: "/companies/accenture.png" },
  { name: "Razorpay", logoUrl: "/companies/razorpay.png" },
  { name: "Swiggy", logoUrl: "/companies/swiggy.png" },
  { name: "Uber", logoUrl: "/companies/uber.png" },
  { name: "Citi", logoUrl: "/companies/citi.png" },
  { name: "KPMG", logoUrl: "/companies/kpmg.png" },
  { name: "Cognizant", logoUrl: "/companies/cognizant.png" },
  { name: "HSBC", logoUrl: "/companies/hsbc.png" },
  { name: "Tata Steel", logoUrl: "/companies/tata-steel.png" },
  { name: "Novartis", logoUrl: "/companies/novartis.png" },
  { name: "JPMorgan Chase & Co.", logoUrl: "/companies/jpmorgan-chase.png" },
  { name: "Genpact", logoUrl: "/companies/genpact.png" },
  { name: "Groww", logoUrl: "/companies/groww.png" },
  { name: "Capgemini", logoUrl: "/companies/capgemini.png" },
  { name: "PwC", logoUrl: "/companies/pwc.png" },
  { name: "Tech Mahindra", logoUrl: "/companies/tech-mahindra.png" },
  { name: "Wipro", logoUrl: "/companies/wipro.png" },
  { name: "Microsoft", logoUrl: "/companies/microsoft.png" },
  { name: "Infosys", logoUrl: "/companies/infosys.png" },
  { name: "Paytm", logoUrl: "/companies/paytm.png" },
];

export default function UpskillingDestinations() {
  return (
    <Reveal
      id="upskilling"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-10 md:px-10 lg:px-16 lg:py-14"
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

      <div className="mt-11 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-6">
        {companies.map((company) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={company.name}
            src={company.logoUrl}
            alt={company.name}
            className="h-10 w-full object-contain opacity-85 transition hover:opacity-100"
          />
        ))}
      </div>
    </Reveal>
  );
}
