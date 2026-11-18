import Image from "next/image";
import type { CSSProperties } from "react";

import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";

export type Mentor = {
  name: string;
  title: string;
  company: string;
  photoUrl: string;
};

/** Sourced from the client's own program brochures ("Top Faculty with CareerZeta"). */
const mentors: Mentor[] = [
  { name: "Arnab Das", title: "Data Engineer", company: "ieng Group", photoUrl: "/faculty/arnab-das.jpg" },
  { name: "Anas Qureshi", title: "Technical Lead", company: "NetSkope", photoUrl: "/faculty/anas-qureshi.jpg" },
  { name: "Devesh Thapliyal", title: "Technology Lead", company: "Infosys", photoUrl: "/faculty/devesh-thapliyal.jpg" },
  { name: "Ashish Dahiya", title: "Sr. Consultant", company: "Centric Consulting", photoUrl: "/faculty/ashish-dahiya.jpg" },
  { name: "Rohit Bhatt", title: "Data Management Engineer", company: "Zurich Insurance", photoUrl: "/faculty/rohit-bhatt.jpg" },
  { name: "Dileep KH", title: "ML Engineer", company: "University of the West of England", photoUrl: "/faculty/dileep-kh.jpg" },
  { name: "Rajendra Dhami", title: "Technical Lead", company: "HCL Tech", photoUrl: "/faculty/rajendra-dhami.jpg" },
  { name: "Divyesh Pandey", title: "Technical Lead", company: "Accenture", photoUrl: "/faculty/divyesh-pandey.jpg" },
  { name: "Ayush Sharma", title: "Sr. Manager", company: "Angel One", photoUrl: "/faculty/ayush-sharma.jpg" },
];

type MentorsProps = {
  heading?: string;
};

/** Deterministic (SSR-safe) pseudo-random in [0, 1), seeded by index + a salt so each bubble's path/timing is decorrelated from its neighbors. */
function seededRand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Gives each bubble its own three-point wander path (via the fx/fy custom
 * properties the cz-bubble-float keyframes read) plus its own
 * duration/delay, so bubbles drift to different points around their spot
 * instead of bobbing in place or moving in lockstep. Horizontal range is
 * kept tighter than vertical so neighbors in the same row never touch.
 */
function floatStyle(i: number): CSSProperties {
  const r = (k: number) => seededRand(i + 1 + k * 7.31);
  const ampX = 15;
  const ampY = 22;
  return {
    "--fx1": `${((r(1) - 0.5) * 2 * ampX).toFixed(1)}px`,
    "--fy1": `${((r(2) - 0.5) * 2 * ampY).toFixed(1)}px`,
    "--fx2": `${((r(3) - 0.5) * 2 * ampX).toFixed(1)}px`,
    "--fy2": `${((r(4) - 0.5) * 2 * ampY).toFixed(1)}px`,
    "--fx3": `${((r(5) - 0.5) * 2 * ampX).toFixed(1)}px`,
    "--fy3": `${((r(6) - 0.5) * 2 * ampY).toFixed(1)}px`,
    "--float-d": `${(9 + r(7) * 7).toFixed(2)}s`,
    "--float-delay": `${(-r(8) * 14).toFixed(2)}s`,
  } as CSSProperties;
}

export default function Mentors({ heading = "Mentors" }: MentorsProps) {
  return (
    <Reveal
      id="mentors"
      className="scroll-mt-24 overflow-visible bg-slate-200 px-6 py-14 md:px-10 lg:px-16 lg:py-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Our strengths
        </h6>
        <h2 className="mt-3.5 font-display text-4xl font-bold">{heading}</h2>
        <p className="mt-3.5 max-w-[60ch] text-[17px] opacity-75">
          Our mentors work in the industry today, guiding learners through
          applied practice, batch by batch. Hover a photo for their role.
        </p>

        <StaggerGroup className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-16 overflow-visible">
          {mentors.map((mentor, i) => (
            <StaggerItem
              key={mentor.name}
              tabIndex={0}
              className="group relative w-[116px] shrink-0 cursor-default text-center outline-none sm:w-[132px]"
            >
              {/* Each bubble wanders its own three-point path at its own pace — randomized but deterministic per index — so the row drifts like actual floating bubbles instead of bobbing in place or moving in lockstep. Paused on hover so the enlarge doesn't fight the drift. */}
              <div
                className="cz-bubble-float group-hover:[animation-play-state:paused] group-focus:[animation-play-state:paused]"
                style={floatStyle(i)}
              >
                {/* Brand rule: photo frame = aqua→deep-aqua gradient border. */}
                <div className="relative mx-auto h-[116px] w-[116px] origin-bottom rounded-full bg-gradient-to-br from-sky-400 to-sky-700 p-1 transition-transform duration-300 ease-out group-hover:z-10 group-hover:scale-[1.3] group-focus:z-10 group-focus:scale-[1.3] sm:h-[132px] sm:w-[132px]">
                  <div className="relative h-full w-full overflow-hidden rounded-full bg-sky-100 shadow-[0_10px_30px_-8px_rgba(17,24,39,0.3)]">
                    <Image
                      src={mentor.photoUrl}
                      alt={mentor.name}
                      fill
                      sizes="140px"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="mt-3 font-display text-sm font-bold">
                  {mentor.name}
                </div>

                <div className="pointer-events-none mt-1 max-h-0 overflow-hidden text-xs opacity-0 transition-all duration-300 ease-out group-hover:max-h-10 group-hover:opacity-70 group-focus:max-h-10 group-focus:opacity-70">
                  {mentor.title}, {mentor.company}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Reveal>
  );
}
