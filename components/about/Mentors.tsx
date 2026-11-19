import Image from "next/image";

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
          applied practice, batch by batch.
        </p>

        <StaggerGroup className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-12 lg:mt-14">
          {mentors.map((mentor) => (
            <StaggerItem
              key={mentor.name}
              tabIndex={0}
              className="group relative w-[116px] shrink-0 cursor-default text-center outline-none sm:w-[132px]"
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

              <div className="mt-3 font-display text-sm font-bold">{mentor.name}</div>

              <div className="mt-1 text-xs opacity-70">
                {mentor.title}, {mentor.company}
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Reveal>
  );
}
