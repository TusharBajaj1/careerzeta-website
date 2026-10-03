import type { Metadata } from "next";

import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import { CONTACT } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy — CareerZeta",
  description: "How CareerZeta collects, uses and protects your information.",
  path: "/privacy-policy",
});

/**
 * Drafted from how this site actually behaves (the forms it runs and what
 * they collect) rather than a generic legal template. Not a substitute for
 * review by a qualified professional before being treated as final.
 */
export default function PrivacyPolicyPage() {
  return (
    <>
      <Reveal className="mx-auto max-w-[820px] px-6 pt-16 pb-16 md:px-10 lg:px-16 lg:pt-20 lg:pb-20">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Legal
        </h6>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm opacity-50">Last updated: September 2026</p>

        <div className="mt-10 flex flex-col gap-8 text-base leading-relaxed opacity-90">
          <p>
            CareerZeta (&quot;CareerZeta&quot;, &quot;we&quot;, &quot;us&quot;)
            respects your privacy. This policy explains what information we
            collect through this website, how we use it, and the choices you
            have.
          </p>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Information we collect
            </h2>
            <p className="mt-2.5">
              We only collect information you choose to give us directly
              through the forms on this site:
            </p>
            <ul className="mt-2.5 list-disc space-y-1.5 pl-5">
              <li>
                <b>Enquiry form</b>{" "}
                (Contact page): your name, email address, mobile number, the
                program you&apos;re interested in, and your message.
              </li>
              <li>
                <b>Mentor / careers form</b>{" "}
                (Contact page): your name, email address, mobile number,
                LinkedIn profile (optional), a CV file (optional), and
                anything you tell us about yourself (optional).
              </li>
            </ul>
            <p className="mt-2.5">
              We do not require you to create an account, and this site does
              not process any payments.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              How we use it
            </h2>
            <p className="mt-2.5">
              We use the information you submit to respond to your enquiry,
              share information about our programs, or consider your interest
              in mentoring or working with CareerZeta. We do not sell your
              personal information to third parties, and we do not use it for
              advertising.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Cookies &amp; tracking
            </h2>
            <p className="mt-2.5">
              This site does not currently use analytics, advertising or
              tracking cookies. If that changes, we&apos;ll update this
              policy to reflect it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Third-party links
            </h2>
            <p className="mt-2.5">
              Our Resources page links to research and articles published by
              third parties (for example, McKinsey, Deloitte, Stanford HAI and
              the World Bank). Those organisations have their own privacy
              practices, which we don&apos;t control.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Your choices
            </h2>
            <p className="mt-2.5">
              You can ask us what information we hold about you, or ask us to
              correct or delete it, at any time by emailing{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="font-semibold text-sky-700 underline decoration-sky-400 decoration-2 underline-offset-4"
              >
                {CONTACT.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Contact us
            </h2>
            <p className="mt-2.5">
              Questions about this policy? Reach us at{" "}
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
