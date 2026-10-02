const LINE =
  "6 Programs · Live Batches · Mentor-led · Certified · Placement Support ·";

export default function Ticker() {
  return (
    <div
      className="overflow-hidden bg-[#111827] py-[22px] text-white"
      aria-label="6 Programs, Live Batches, Mentor-led, Certified, Placement Support"
    >
      <div
        className="cz-marquee flex w-max font-display text-[22px] font-semibold tracking-tight"
        aria-hidden
      >
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="pr-12 whitespace-nowrap">
            {LINE}
          </span>
        ))}
      </div>
    </div>
  );
}
