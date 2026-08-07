import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

import { CONTACT } from "@/lib/content";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const programs = ["Data Analytics", "Applied AI", "Machine Learning"];

const connect = [
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/careerzeta",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/careerzeta",
  },
  {
    icon: Mail,
    label: "Email",
    href: `mailto:${CONTACT.email}`,
  },
];

const legal = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 px-6 pt-16 pb-10 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/brand/careerzeta-mark-white.png"
                alt=""
                width={632}
                height={544}
                className="h-7 w-auto"
              />
              <span className="font-display text-lg font-bold text-white">
                CareerZeta
              </span>
            </div>

            <p className="mt-4 max-w-[32ch] text-sm text-white opacity-60">
              Keeping professionals on pace with technology, one mentor-led
              skill at a time.
            </p>

            <div className="mt-6 flex items-center gap-4">
              {connect.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="text-white/60 transition hover:text-sky-400"
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[13px] tracking-[0.06em] text-white uppercase opacity-50">
              Navigate
            </div>
            <div className="mt-4 flex flex-col gap-2.5">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[15px] text-white opacity-85 transition hover:text-sky-400 hover:opacity-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[13px] tracking-[0.06em] text-white uppercase opacity-50">
              Programs
            </div>
            <div className="mt-4 flex flex-col gap-2.5">
              {programs.map((program) => (
                <Link
                  key={program}
                  href="/programs"
                  className="text-[15px] text-white opacity-75 transition hover:text-sky-400 hover:opacity-100"
                >
                  {program}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[13px] tracking-[0.06em] text-white uppercase opacity-50">
              Contact
            </div>
            <div className="mt-4 flex flex-col gap-2.5">
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-[15px] text-white opacity-75 transition hover:text-sky-400 hover:opacity-100"
              >
                {CONTACT.email}
              </a>
              <span className="text-[15px] text-white opacity-75">
                {CONTACT.web}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
          <span className="text-sm text-white opacity-50">
            © {new Date().getFullYear()} CareerZeta
          </span>

          <div className="flex gap-6">
            {legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white opacity-50 transition hover:text-sky-400 hover:opacity-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
