"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import ScrollProgress from "@/components/ui/ScrollProgress";

const links = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Resources", href: "/resources" },
  { label: "About Us", href: "/about" },
];

/** Pages with a dark full-bleed hero the nav floats transparently over. */
const HERO_PAGES = ["/", "/programs"];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparent-over-hero only holds for the very top of the page — Hero's
  // own text scrolls up into the nav's band almost immediately, so this must
  // solidify on the first sign of scrolling, not partway down the hero.
  const isHeroPage = HERO_PAGES.includes(pathname);
  const isHeroOverlay = isHeroPage && !scrolled && !open;

  return (
    <>
      <ScrollProgress />

      <nav
        className={`${isHeroPage ? "fixed inset-x-0" : "sticky"} top-0 z-40 w-full border-b-2 transition-colors duration-300 ${
          isHeroOverlay
            ? "border-transparent bg-transparent"
            : `border-line bg-[#fafafa] ${scrolled ? "shadow-[0_8px_24px_rgba(17,24,39,0.08)]" : ""}`
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center gap-9 px-6 py-4 md:px-10 lg:px-16">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image
              src={isHeroOverlay ? "/brand/careerzeta-mark-white.png" : "/brand/careerzeta-mark.png"}
              alt=""
              width={632}
              height={544}
              loading="eager"
              fetchPriority="high"
              className="h-8 w-auto"
            />
            <span
              className={`font-display text-xl font-bold ${isHeroOverlay ? "text-white" : ""}`}
            >
              CareerZeta
            </span>
          </Link>

          <div className="ml-auto hidden items-center gap-9 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 text-[15px] font-semibold whitespace-nowrap transition ${
                  isHeroOverlay ? "text-white hover:text-sky-300" : "hover:text-sky-700"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/contact"
              className="shrink-0 rounded-lg bg-sky-400 px-5 py-3 text-[15px] font-bold whitespace-nowrap text-slate-900 transition-transform duration-150 hover:scale-105"
            >
              Contact Us
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`ml-auto rounded-lg p-2 md:hidden ${isHeroOverlay ? "text-white" : ""}`}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open ? (
          <div className="border-t-2 border-line bg-[#fafafa] px-6 pb-5 md:hidden">
            <div className="flex flex-col gap-1 pt-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-[15px] font-semibold transition hover:bg-white"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg bg-sky-400 px-5 py-3 text-center text-[15px] font-bold text-slate-900"
              >
                Contact Us
              </Link>
            </div>
          </div>
        ) : null}
      </nav>
    </>
  );
}
