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
  { name: "Arnab Das", title: "Data Engineer", company: "Ieng Group", photoUrl: "/faculty/arnab-das.jpg" },
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
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-16 md:px-10 lg:px-16 lg:py-20"
    >
      <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
        Our strengths
      </h6>
      <h2 className="mt-3.5 font-display text-4xl font-bold">{heading}</h2>
      <p className="mt-3.5 max-w-[60ch] text-[17px] opacity-75">
        Our mentors work in the industry today, guiding learners through applied
        practice, batch by batch.
      </p>

      <StaggerGroup className="mt-11 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {mentors.map((mentor) => (
          <StaggerItem
            key={mentor.name}
            className="flex flex-col gap-3.5 transition-transform duration-200 hover:-translate-y-2"
          >
            <Image
              src={mentor.photoUrl}
              alt={mentor.name}
              width={400}
              height={400}
              className="h-45 w-full rounded-[14px] object-cover"
            />
            <div className="font-display text-base font-bold">{mentor.name}</div>
            <div className="text-sm opacity-60">
              {mentor.title}, {mentor.company}
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Reveal>
  );
}
