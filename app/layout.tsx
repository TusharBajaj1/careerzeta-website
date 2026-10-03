import type { Metadata } from "next";
import { Manrope, Poppins } from "next/font/google";
import "./globals.css";

import LeadCaptureProvider from "@/components/lead-capture/LeadCaptureProvider";
import Navbar from "@/components/layout/Navbar";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { CONTACT } from "@/lib/content";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.careerzeta.com"),
  title: "CareerZeta — Mentor-led courses in data and AI",
  description:
    "CareerZeta pairs learners with qualified mentors across six live, mentor-led programs so professionals keep pace with technology, not behind it.",
  verification: {
    google: "Ef_wDJhzrXumrNJw0PL82wEsCofNlTZagPNYCx1y-S0",
  },
};

/**
 * Tells Google this site, its LinkedIn page and its Instagram account are
 * the same organization — the `sameAs` links are what let a branded search
 * surface the official profiles instead of unrelated name matches.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "CareerZeta",
  url: "https://www.careerzeta.com",
  logo: "https://www.careerzeta.com/brand/careerzeta-mark.png",
  email: CONTACT.email,
  telephone: CONTACT.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.address,
  },
  sameAs: [CONTACT.linkedin, CONTACT.instagram],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // data-scroll-behavior is required in Next 16 for the framework to keep
    // route transitions instant while `scroll-smooth` handles in-page anchors.
    <html
      lang="en"
      className={`${manrope.variable} ${poppins.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <LeadCaptureProvider>
          <Navbar />

          <main>{children}</main>

          <WhatsAppButton />
        </LeadCaptureProvider>
      </body>
    </html>
  );
}
