import type { Metadata } from "next";

import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import { CONTACT } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use — CareerZeta",
  description: "The terms that govern your use of the CareerZeta website.",
  path: "/terms-of-use",
});

/**
 * Drafted from how this site actually behaves rather than a generic legal
 * template. Not a substitute for review by a qualified professional before
 * being treated as final.
 */
export default function TermsOfUsePage() {
  return (
    <>
      <Reveal className="mx-auto max-w-[820px] px-6 pt-16 pb-16 md:px-10 lg:px-16 lg:pt-20 lg:pb-20">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Legal
        </h6>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">
          Terms of Use
        </h1>
        <p className="mt-4 text-sm opacity-50">Last updated: September 2026</p>

        <div className="mt-10 flex flex-col gap-8 text-base leading-relaxed opacity-90">
          <p>
            These terms govern your use of the CareerZeta website. By using
            this site, you agree to them.
          </p>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Using this site
            </h2>
            <p className="mt-2.5">
              This site is provided to share information about CareerZeta&apos;s
              programs and to let you get in touch with us. You agree to use
              it only for lawful purposes, and not to submit false or
              misleading information through our forms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Program information
            </h2>
            <p className="mt-2.5">
              Program details, curricula, durations and brochures on this site
              describe our programs as currently designed and may change over
              time. Where a program&apos;s brochure isn&apos;t yet available,
              the site says so rather than showing placeholder details.
              Enrolment in a program is subject to a separate agreement
              between you and CareerZeta at the time you sign up.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Intellectual property
            </h2>
            <p className="mt-2.5">
              The content on this site — text, design, graphics and the
              CareerZeta name and logo — belongs to CareerZeta unless
              otherwise credited, and may not be reproduced without our
              permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Third-party content and links
            </h2>
            <p className="mt-2.5">
              Our Resources page links to research and articles published by
              third parties. We link to them because we found them credible,
              but we don&apos;t control their content and aren&apos;t
              responsible for it. Company names shown on our About page
              illustrate roles our skills are relevant to; they are not
              partners, recruiters, or a placement guarantee.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              No warranty
            </h2>
            <p className="mt-2.5">
              We try to keep this site accurate and up to date, but it&apos;s
              provided &quot;as is&quot; without warranties of any kind, and
              we&apos;re not liable for decisions made solely on the basis of
              information found here.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Governing law
            </h2>
            <p className="mt-2.5">
              These terms are governed by the laws of India.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Contact us
            </h2>
            <p className="mt-2.5">
              Questions about these terms? Reach us at{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="font-semibold text-sky-700 underline decoration-sky-400 decoration-2 underline-offset-4"
              >
                {CONTACT.email}
              </a>{" "}
              or{" "}
              <a
                href={`tel:${CONTACT.phone}`}
                className="font-semibold text-sky-700 underline decoration-sky-400 decoration-2 underline-offset-4"
              >
                {CONTACT.phone}
              </a>
              .
            </p>
          </section>
        </div>
      </Reveal>

      <Footer />
    </>
  );
}
