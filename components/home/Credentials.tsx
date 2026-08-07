import { ScrollText } from "lucide-react";

import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import Reveal from "@/components/ui/Reveal";

export default function Credentials() {
  return (
    <Reveal className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 py-20 md:px-10 lg:grid-cols-2 lg:gap-20 lg:px-16 lg:py-28">
      <div>
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Credentials
        </h6>
        <h2 className="mt-3.5 max-w-[20ch] font-display text-[32px] font-bold">
          A certificate that means the program was finished, not just started
        </h2>
        <p className="mt-4 max-w-[48ch] text-[17px] leading-[1.55] opacity-75">
          Every completed program is certified, and our industry connect helps
          graduates put that certificate in front of the people hiring for these
          skills.
        </p>
      </div>

      <div className="rounded-[20px] bg-gradient-to-br from-sky-400 via-gray-900 to-sky-400 p-1.5 cz-gradient-drift">
        <MediaPlaceholder
          icon={ScrollText}
          label="Sample certificate of completion"
          className="h-70 w-full rounded-2xl"
        />
      </div>
    </Reveal>
  );
}
