import type { Metadata } from "next";

import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import { CONTACT } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Refund and Cancellation Policy — CareerZeta",
  description: "CareerZeta's policy on cancelling an enrollment and refunds for program fees.",
  path: "/refund-and-cancellation-policy",
});

/**
 * Drafted from the business's actual policy as confirmed directly, not a
 * generic legal template. Not a substitute for review by a qualified
 * professional before being treated as final.
 */
export default function RefundAndCancellationPolicyPage() {
  return (
    <>
      <Reveal className="mx-auto max-w-[820px] px-6 pt-16 pb-16 md:px-10 lg:px-16 lg:pt-20 lg:pb-20">
        <h6 className="text-sm font-bold tracking-[0.06em] text-sky-700 uppercase">
          Legal
        </h6>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">
          Refund and Cancellation Policy
        </h1>
        <p className="mt-4 text-sm opacity-70">Last updated: October 2026</p>

        <div className="mt-10 flex flex-col gap-8 text-base leading-relaxed opacity-90">
          <p>
            This policy covers cancelling your enrollment in a CareerZeta program and
            what, if anything, is refunded depending on when you cancel.
          </p>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Registration fee
            </h2>
            <p className="mt-2.5">
              The registration fee secures your seat in a program and is{" "}
              <strong>non-refundable</strong> once paid, regardless of when you cancel —
              including if you cancel before the program starts.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Cancelling before the program starts
            </h2>
            <p className="mt-2.5">
              If you&apos;ve paid the full program fee and cancel before your program&apos;s
              start date, we refund everything you paid beyond the registration fee.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Cancelling after the program starts
            </h2>
            <p className="mt-2.5">
              Once your program has started, the remaining fee (everything beyond the
              registration fee) is refunded on a <strong>pro-rated basis</strong> — you&apos;re
              refunded for the portion of the program not yet delivered as of your
              cancellation date, based on sessions completed out of the program&apos;s total
              sessions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              How to request a cancellation
            </h2>
            <p className="mt-2.5">
              Email{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="font-semibold text-sky-700 underline decoration-sky-400 decoration-2 underline-offset-4"
              >
                {CONTACT.email}
              </a>{" "}
              with your name and enrolled program, and we&apos;ll confirm your cancellation
              and any refund amount due.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Refund timeline
            </h2>
            <p className="mt-2.5">
              Once a refund is approved, it&apos;s processed within{" "}
              <strong>30 business days</strong> back to your original payment method.
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
