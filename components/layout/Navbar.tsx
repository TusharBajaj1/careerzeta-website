import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10 lg:px-16">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Career<span className="text-sky-600">Zeta</span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">

          <Link href="/" className="transition hover:text-slate-950">
            Home
          </Link>

          <Link href="/programs" className="transition hover:text-slate-950">
            Programs
          </Link>

          <Link href="/resources" className="transition hover:text-slate-950">
            Resources
          </Link>

          <Link href="/about" className="transition hover:text-slate-950">
            About
          </Link>

          <Link href="/contact" className="transition hover:text-slate-950">
            Contact
          </Link>

        </div>

        {/* CTA */}
        <Link
          href="/contact"
          className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Talk to Us
        </Link>

      </div>
    </nav>
  );
}