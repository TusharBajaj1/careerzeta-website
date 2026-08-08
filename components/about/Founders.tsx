import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";

import Reveal from "@/components/ui/Reveal";

export type Founder = {
  name: string;
  photoUrl: string;
  education: string;
  experience: string;
  linkedinUrl: string;
};

/**
 * No founder profiles have been supplied yet. Per the content brief, this
 * section must not ship placeholder people — populate this array and the
 * grid below renders; until then it shows a plain pending note.
 */
const founders: Founder[] = [];

export default function Founders() {
  return (
    <Reveal
      id="founders"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-20 md:px-10 lg:px-16 lg:py-28"
    >
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        Our strengths
      </h6>
      <h2 className="mt-3.5 font-display text-4xl font-bold">
        People behind CareerZeta
      </h2>

      {founders.length > 0 ? (
        <div className="mt-11 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {founders.map((founder) => (
            <div key={founder.name} className="flex flex-col gap-3.5">
              <Image
                src={founder.photoUrl}
                alt={founder.name}
                width={400}
                height={400}
                className="h-45 w-full rounded-[14px] object-cover"
              />
              <div className="flex items-center justify-between gap-3">
                <div className="font-display text-base font-bold">
                  {founder.name}
                </div>
                <a
                  href={founder.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${founder.name} on LinkedIn`}
                  className="text-slate-400 transition hover:text-sky-600"
                >
                  <FaLinkedin className="h-5 w-5" />
                </a>
              </div>
              <div className="text-sm opacity-60">{founder.education}</div>
              <div className="text-sm opacity-60">{founder.experience}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3.5 max-w-[60ch] text-[17px] opacity-60 italic">
          Founder profiles are on the way.
        </p>
      )}
    </Reveal>
  );
}
