import { UserRound } from "lucide-react";

import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import Reveal from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";

const mentorSlots = [1, 2, 3, 4];

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
        {mentorSlots.map((slot) => (
          <StaggerItem
            key={slot}
            className="flex flex-col gap-3.5 transition-transform duration-200 hover:-translate-y-2"
          >
            <MediaPlaceholder
              icon={UserRound}
              label="Mentor photo"
              className="h-45 w-full rounded-[14px]"
            />
            <div className="font-display text-base font-bold">Mentor name</div>
            <div className="text-sm opacity-60">Title, company placeholder</div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Reveal>
  );
}
