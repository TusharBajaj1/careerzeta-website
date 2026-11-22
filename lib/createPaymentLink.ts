import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { payments, type Enrollment, type Payment } from "@/lib/db/schema";
import {
  createEasebuzzPaymentLink,
  generateEasebuzzTxnId,
  isEasebuzzConfigured,
  sanitizeEasebuzzPhone,
  sanitizeEasebuzzProductInfo,
} from "@/lib/easebuzz";
import { getRazorpayClient } from "@/lib/razorpay";

const SITE_URL = "https://www.careerzeta.com";

export function isGatewayConfigured(gateway: "razorpay" | "easebuzz"): boolean {
  return gateway === "easebuzz" ? isEasebuzzConfigured() : getRazorpayClient() !== null;
}

/**
 * Generates a real payment link on the given gateway for an already-created
 * "created"-status payment row, and persists the link fields on it.
 * Shared by the single-payment route and the installment-plan route (which
 * calls this once per installment) so there's one place that talks to
 * Razorpay/Easebuzz, not two copies that can drift.
 */
export async function generatePaymentLink(params: {
  enrollment: Enrollment;
  payment: Payment;
  gateway: "razorpay" | "easebuzz";
  description: string;
}): Promise<Payment> {
  const { enrollment, payment, gateway, description } = params;

  if (gateway === "easebuzz") {
    const txnid = generateEasebuzzTxnId(payment.id);
    const link = await createEasebuzzPaymentLink({
      txnid,
      amountPaise: payment.amount,
      productInfo: sanitizeEasebuzzProductInfo(description),
      firstName: enrollment.candidateName,
      email: enrollment.candidateEmail,
      phone: sanitizeEasebuzzPhone(enrollment.candidatePhone),
      successUrl: `${SITE_URL}/enroll/thank-you`,
      failureUrl: `${SITE_URL}/enroll/thank-you`,
      udf1: String(enrollment.id),
      udf2: String(payment.id),
    });

    const [updated] = await db
      .update(payments)
      .set({ easebuzzTxnId: link.txnid, paymentLinkUrl: link.paymentLinkUrl })
      .where(eq(payments.id, payment.id))
      .returning();
    return updated;
  }

  const razorpay = getRazorpayClient();
  if (!razorpay) {
    throw new Error("Razorpay is not configured");
  }
  const link = await razorpay.paymentLink.create({
    amount: payment.amount,
    currency: "INR",
    accept_partial: false,
    customer: {
      name: enrollment.candidateName,
      email: enrollment.candidateEmail,
      contact: enrollment.candidatePhone,
    },
    notify: { email: true, sms: true },
    reference_id: `enrollment-${enrollment.id}-payment-${payment.id}`,
    notes: { enrollmentId: String(enrollment.id), paymentId: String(payment.id) },
    description,
    callback_url: `${SITE_URL}/enroll/thank-you`,
    callback_method: "get",
  });

  const [updated] = await db
    .update(payments)
    .set({ razorpayPaymentLinkId: link.id, paymentLinkUrl: link.short_url })
    .where(eq(payments.id, payment.id))
    .returning();
  return updated;
}
