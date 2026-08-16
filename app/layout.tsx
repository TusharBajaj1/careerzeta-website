import type { Metadata } from "next";
import { Manrope, Poppins } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";

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
  title: "CareerZeta — Mentor-led courses in data and AI",
  description:
    "CareerZeta pairs learners with qualified mentors across six live, mentor-led programs so professionals keep pace with technology, not behind it.",
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
        <Navbar />

        <main>{children}</main>
      </body>
    </html>
  );
}
