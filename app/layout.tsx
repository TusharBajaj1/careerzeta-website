import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CareerZeta | Build Your Career in Business Analytics",
  description:
    "CareerZeta helps professionals transition into and grow their careers in Business Analytics through industry-led learning and mentorship.",
  keywords: [
    "Business Analytics",
    "Business Analytics Course",
    "CareerZeta",
    "Business Analyst",
    "Mentorship",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}