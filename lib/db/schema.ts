import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/** All money columns are in paise (smallest INR unit) — matches Razorpay's own API, avoids float rounding. */

export const couponStatusEnum = pgEnum("coupon_status", [
  "active",
  "used",
  "expired",
  "revoked",
]);

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "pending",
  "registration_paid",
  "fully_paid",
  "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "created",
  "paid",
  "failed",
  "expired",
]);

export const paymentTypeEnum = pgEnum("payment_type", [
  "full",
  "registration",
  "balance",
]);

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  /** Exactly one of discountPercent/discountAmount is set per coupon. */
  discountPercent: integer("discount_percent"),
  discountAmount: integer("discount_amount"),
  /** Null = applies to any program. */
  programSlug: varchar("program_slug", { length: 64 }),
  /** At least one of email/phone is required at the validation layer — this is the restriction that makes a coupon usable only by the chosen candidate. */
  candidateEmail: varchar("candidate_email", { length: 255 }),
  candidatePhone: varchar("candidate_phone", { length: 32 }),
  maxUses: integer("max_uses").notNull().default(1),
  usedCount: integer("used_count").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  status: couponStatusEnum("status").notNull().default("active"),
  /** Free-text name/initials of the admin who created it — no per-user accounts, so no FK. */
  createdBy: varchar("created_by", { length: 128 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  candidateName: varchar("candidate_name", { length: 255 }).notNull(),
  candidateEmail: varchar("candidate_email", { length: 255 }).notNull(),
  candidatePhone: varchar("candidate_phone", { length: 32 }).notNull(),
  programSlug: varchar("program_slug", { length: 64 }).notNull(),
  couponId: integer("coupon_id").references(() => coupons.id),
  /** Final price in paise, after any discount — what the candidate owes in total. */
  totalFee: integer("total_fee").notNull(),
  /** Running total of paid (successful) payments, in paise. */
  amountPaid: integer("amount_paid").notNull().default(0),
  status: enrollmentStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id")
    .notNull()
    .references(() => enrollments.id),
  type: paymentTypeEnum("type").notNull(),
  /** Amount for this specific transaction, in paise. */
  amount: integer("amount").notNull(),
  status: paymentStatusEnum("status").notNull().default("created"),
  razorpayPaymentLinkId: varchar("razorpay_payment_link_id", { length: 128 }),
  razorpayPaymentId: varchar("razorpay_payment_id", { length: 128 }),
  paymentLinkUrl: text("payment_link_url"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  invoiceSent: boolean("invoice_sent").notNull().default(false),
  invoiceNumber: varchar("invoice_number", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;
export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
