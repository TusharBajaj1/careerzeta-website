import Link from "next/link";
import { Linkedin, Instagram, Mail } from "lucide-react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const learning = [
  { label: "Business Analytics Program", href: "/programs" },
  { label: "Industry Reports", href: "/resources" },
];

const connect = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/careerzeta",
  },
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/careerzeta",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:hello@careerzeta.com",
  },
];

const legal = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">

        {/* Top Section */}
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-slate-950"
            >
              Career<span className="text-sky-600">Zeta</span>
            </Link>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Preparing professionals for the future of Business Analytics
              through practical, industry-focused learning.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Navigation
            </h3>

            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Learning
            </h3>

            <ul className="mt-5 space-y-3">
              {learning.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Connect
            </h3>

            <ul className="mt-5 space-y-3">
              {connect.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 text-sm font-medium text-slate-600 transition hover:text-slate-950"
                    >
                      <Icon
                        className="h-4 w-4 text-slate-400 transition group-hover:text-sky-600"
                        strokeWidth={1.8}
                      />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CareerZeta. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {legal.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-slate-500 transition hover:text-slate-950"
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