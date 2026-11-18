import MentorBubbleField from "@/components/about/MentorBubbleField";
import Reveal from "@/components/ui/Reveal";

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
          applied practice, batch by batch. Hover a photo for their role.
        </p>

        <MentorBubbleField mentors={mentors} />
      </div>
    </Reveal>
  );
}
