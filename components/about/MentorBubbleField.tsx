"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import type { Mentor } from "@/components/about/Mentors";

type Vec = { x: number; y: number };

/** Size reserved per bubble for arena bounds math. */
const BUBBLE_SIZE = 132;
/** Extra vertical room below each circle for its name plus its always-visible title/company, which can wrap onto two lines for a longer title. */
const CAPTION_HEIGHT = 72;
const SPEED_MIN = 16; // px/s
const SPEED_MAX = 30; // px/s
/**
 * Centers closer than this deflect apart instead of overlapping — the
 * actual collision, not just avoidance of a pre-picked point. Sized for
 * the worst case (one bubble's full-height caption landing right above
 * a neighbor directly below it: circle radius + caption + circle
 * radius), not just circle-to-circle, since the caption text is always
 * visible now rather than only appearing on hover.
 */
const REPEL_DIST = 205;
/** Small per-frame chance of a gentle random heading change, so paths read as organic drift rather than a mechanical, perfectly-predictable bounce loop. */
const TURN_CHANCE_PER_FRAME = 0.004;
const MAX_DT = 0.05; // clamp so a slow/dropped frame can't cause a big jump
/**
 * Below this width there's no honest way to fit 9 roaming, labeled bubbles
 * — each needing a ~205px clearance bubble now that its caption is always
 * shown — without them constantly crowding each other. Below it this
 * renders a plain wrapping grid instead (the browser's own flex-wrap, so
 * it's correct at any width, not a hand-rolled column count that can
 * still get it wrong). It's also what prefers-reduced-motion gets, and
 * what every viewport sees before JS has measured anything, so there's
 * no flash.
 */
const MIN_ROAM_WIDTH = 1200;

type MentorBubbleFieldProps = {
  mentors: Mentor[];
};

function BubbleContent({ mentor }: { mentor: Mentor }) {
  return (
    <>
      {/* Brand rule: photo frame = aqua→deep-aqua gradient border. */}
      <div className="relative mx-auto h-[116px] w-[116px] origin-bottom rounded-full bg-gradient-to-br from-sky-400 to-sky-700 p-1 transition-transform duration-300 ease-out group-hover:z-20 group-hover:scale-[1.3] group-focus:z-20 group-focus:scale-[1.3] sm:h-[132px] sm:w-[132px]">
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
    </>
  );
}

/** Plain, naturally-wrapping grid — correct at any width by construction, since it's the browser's own flex layout rather than JS-computed positions. */
function MentorBubbleGrid({ mentors }: MentorBubbleFieldProps) {
  return (
    <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-12 lg:mt-14">
      {mentors.map((mentor) => (
        <div
          key={mentor.name}
          tabIndex={0}
          className="group relative w-[116px] shrink-0 cursor-default text-center outline-none sm:w-[132px]"
        >
          <BubbleContent mentor={mentor} />
        </div>
      ))}
    </div>
  );
}

/**
 * A continuous particle simulation, not a handful of discrete waypoints:
 * each bubble has its own position and velocity, bounces off the arena
 * walls, and deflects off any bubble it gets close to in real time — so
 * two bubbles never end up sitting on each other however their paths
 * happen to cross, not just at the moments they pick a new target. Runs
 * via requestAnimationFrame and writes position straight to the DOM
 * (not React state), so animating 9 bubbles at 60fps isn't 60
 * re-renders/sec. Pauses on hover/focus so the enlarge interaction
 * stays put, and sits out entirely under prefers-reduced-motion (the
 * MentorBubbleGrid fallback handles that case too).
 */
export default function MentorBubbleField({ mentors }: MentorBubbleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const pausedRef = useRef<boolean[]>(mentors.map(() => false));

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const checkMotionPreference = () =>
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    checkMotionPreference();
  }, []);

  const isRoamMode = size.width >= MIN_ROAM_WIDTH;
  const showGrid = !isRoamMode || prefersReducedMotion;

  useLayoutEffect(() => {
    if (showGrid || size.height === 0) return;

    const maxX = Math.max(0, size.width - BUBBLE_SIZE);
    const maxY = Math.max(0, size.height - BUBBLE_SIZE - CAPTION_HEIGHT);

    const placeAt = (positions: Vec[]) => {
      mentors.forEach((_, i) => {
        const el = bubbleRefs.current[i];
        if (el) {
          el.style.left = `${positions[i].x}px`;
          el.style.top = `${positions[i].y}px`;
        }
      });
    };

    // Scatter the starting points with the same spacing the live simulation maintains, so bubbles don't start on top of each other.
    const positions: Vec[] = [];
    mentors.forEach(() => {
      let best = { x: 0, y: 0 };
      let bestDist = -Infinity;
      for (let attempt = 0; attempt < 40; attempt++) {
        const candidate = { x: Math.random() * maxX, y: Math.random() * maxY };
        let dist = Infinity;
        positions.forEach((p) => {
          dist = Math.min(dist, Math.hypot(p.x - candidate.x, p.y - candidate.y));
        });
        if (dist > bestDist) {
          bestDist = dist;
          best = candidate;
        }
        if (bestDist >= REPEL_DIST) break;
      }
      positions.push(best);
    });
    placeAt(positions);

    const velocities: Vec[] = mentors.map(() => {
      const angle = Math.random() * Math.PI * 2;
      const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
      return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
    });

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, MAX_DT);
      last = now;

      mentors.forEach((_, i) => {
        if (pausedRef.current[i]) return;

        if (Math.random() < TURN_CHANCE_PER_FRAME) {
          const angle = Math.atan2(velocities[i].y, velocities[i].x) + (Math.random() - 0.5) * 1.4;
          const speed = Math.hypot(velocities[i].x, velocities[i].y);
          velocities[i] = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
        }

        positions[i].x += velocities[i].x * dt;
        positions[i].y += velocities[i].y * dt;

        if (positions[i].x < 0) {
          positions[i].x = 0;
          velocities[i].x = Math.abs(velocities[i].x);
        } else if (positions[i].x > maxX) {
          positions[i].x = maxX;
          velocities[i].x = -Math.abs(velocities[i].x);
        }
        if (positions[i].y < 0) {
          positions[i].y = 0;
          velocities[i].y = Math.abs(velocities[i].y);
        } else if (positions[i].y > maxY) {
          positions[i].y = maxY;
          velocities[i].y = -Math.abs(velocities[i].y);
        }
      });

      for (let i = 0; i < mentors.length; i++) {
        for (let j = i + 1; j < mentors.length; j++) {
          if (pausedRef.current[i] || pausedRef.current[j]) continue;
          const dx = positions[i].x - positions[j].x;
          const dy = positions[i].y - positions[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < REPEL_DIST) {
            const overlap = (REPEL_DIST - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;
            positions[i].x = Math.min(Math.max(positions[i].x + nx * overlap, 0), maxX);
            positions[i].y = Math.min(Math.max(positions[i].y + ny * overlap, 0), maxY);
            positions[j].x = Math.min(Math.max(positions[j].x - nx * overlap, 0), maxX);
            positions[j].y = Math.min(Math.max(positions[j].y - ny * overlap, 0), maxY);

            const speedI = Math.hypot(velocities[i].x, velocities[i].y);
            const speedJ = Math.hypot(velocities[j].x, velocities[j].y);
            velocities[i] = { x: nx * speedI, y: ny * speedI };
            velocities[j] = { x: -nx * speedJ, y: -ny * speedJ };
          }
        }
      }

      placeAt(positions);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showGrid, size.width, size.height]);

  return (
    <div
      ref={containerRef}
      className={showGrid ? "w-full" : "relative mt-14 h-[680px] w-full overflow-visible"}
    >
      {showGrid ? (
        <MentorBubbleGrid mentors={mentors} />
      ) : (
        mentors.map((mentor, i) => (
          <div
            key={mentor.name}
            ref={(el) => {
              bubbleRefs.current[i] = el;
            }}
            tabIndex={0}
            className="group absolute w-[132px] cursor-default text-center outline-none"
            onMouseEnter={() => {
              pausedRef.current[i] = true;
            }}
            onMouseLeave={() => {
              pausedRef.current[i] = false;
            }}
            onFocus={() => {
              pausedRef.current[i] = true;
            }}
            onBlur={() => {
              pausedRef.current[i] = false;
            }}
          >
            <BubbleContent mentor={mentor} />
          </div>
        ))
      )}
    </div>
  );
}
