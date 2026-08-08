import type { Metadata } from "next";

import LetsTalk from "@/components/contact/LetsTalk";
import WorkWithUs from "@/components/contact/WorkWithUs";
import WorkWithUsForm from "@/components/contact/WorkWithUsForm";
import Reveal from "@/components/ui/Reveal";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Contact Us — CareerZeta",
  description:
    "Get in touch about a program, mentorship, or working with CareerZeta.",
};

export default function ContactPage() {
  return (
    <>
      <LetsTalk />
      <WorkWithUs />

      <Reveal
        id="work-with-us-form"
        className="mx-auto max-w-[800px] scroll-mt-24 px-6 py-20 md:px-10 lg:px-16 lg:py-28"
      >
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Mentors &amp; careers
        </h6>
        <h2 className="mt-3.5 font-display text-3xl font-bold md:text-4xl">
          Tell us a bit about yourself
        </h2>
        <p className="mt-3.5 text-base leading-relaxed opacity-75">
          Whether you want to mentor, join CareerZeta, or both — this is the
          one form for it.
        </p>

        <div className="mt-9 rounded-2xl border-2 border-line bg-slate-50 p-6 sm:p-8">
          <WorkWithUsForm />
        </div>
      </Reveal>

      <Footer />
    </>
  );
}
