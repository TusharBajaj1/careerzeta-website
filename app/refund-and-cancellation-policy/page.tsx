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
            We want you to enroll with confidence. This policy explains what happens if
            your plans change — written to be fair to you as a professional investing in
            your growth, and to CareerZeta as the organization committing mentors,
            cohort seats and resources to your program from the day you sign up.
          </p>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              How you can pay
            </h2>
            <p className="mt-2.5">
              You can enroll in two ways: pay the full program fee upfront, or pay a
              smaller registration fee now and the remaining balance later. Either way
              works — what you get back if you cancel depends on which path you chose
              and when you cancel.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              The registration fee is non-refundable
            </h2>
            <p className="mt-2.5">
              The moment you pay your registration fee, we reserve your seat in the
              cohort and begin planning around it — mentor allocation, batch sizing and
              scheduling all happen on the assumption you&apos;re joining. Because that
              commitment is made on our end immediately, the registration fee itself
              isn&apos;t refundable, however early you cancel.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Cancelling before the program starts
            </h2>
            <p className="mt-2.5">
              If you&apos;ve paid more than the registration fee and cancel before your
              program&apos;s start date, we refund everything you paid beyond it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Paid in full? You get a 15-day trial.
            </h2>
            <p className="mt-2.5">
              If you pay your full program fee upfront, you get <strong>15 days</strong>{" "}
              from your program&apos;s start date to make sure it&apos;s genuinely right
              for you. Cancel within that window, and we refund everything you paid
              beyond the registration fee — no questions asked. This exists because
              committing to the full fee upfront is a bigger step, and we think you
              should be able to take it without worrying you&apos;re locked in before
              you&apos;ve even experienced the program.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              After that
            </h2>
            <p className="mt-2.5">
              Once your 15-day trial has passed, or once your program has started if
              you chose to pay via registration fee + balance, fees paid are no longer
              refundable.
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
