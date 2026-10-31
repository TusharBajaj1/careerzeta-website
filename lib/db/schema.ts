import {
  boolean,
  integer,
  pgEnum,
  pgSequence,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Invoice numbers must be unique and consecutive (gapless) for GST
 * compliance — payments.id can't be used directly since not every payment
 * row that gets created is ever actually invoiced (abandoned/failed
 * Razorpay links). nextval() is only called at the moment an invoice is
 * actually generated, so this sequence has no such gaps.
 */
export const invoiceNumberSeq = pgSequence("invoice_number_seq", {
  startWith: 1,
  increment: 1,
});

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
  "refund_requested",
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

export const blogPostStatusEnum = pgEnum("blog_post_status", ["draft", "published"]);

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
  /** Case-by-case registration-fee amount in paise the sales exec negotiated for this candidate — null means the "pay a registration fee" option isn't offered to anyone using this coupon. */
  registrationFeeAmount: integer("registration_fee_amount"),
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
  /** Determines CGST+SGST (same state as CareerZeta, Uttar Pradesh) vs IGST (any other state) on the tax invoice. */
  candidateState: varchar("candidate_state", { length: 64 }),
  /** Street/billing address shown on the tax invoice — optional, since not every candidate needs it on the document. */
  candidateAddress: text("candidate_address"),
  /** GSTIN of the candidate's employer, if they want it on the invoice for input tax credit — optional. */
  candidateGstin: varchar("candidate_gstin", { length: 15 }),
  programSlug: varchar("program_slug", { length: 64 }).notNull(),
  couponId: integer("coupon_id").references(() => coupons.id),
  /** Owner of the lead — defaults to the linked coupon's createdBy, or set directly on admin-created enrollments. */
  salesExecutive: varchar("sales_executive", { length: 128 }),
  /** Final price in paise, after any discount — what the candidate owes in total. */
  totalFee: integer("total_fee").notNull(),
  /**
   * Registration-fee amount in paise, if this candidate has one — set by
   * the sales exec directly (admin-created enrollment) or copied in from
   * the coupon they used at self-registration. Null means only full
   * payment is offered. This is the field a self-service candidate's quote
   * reads when they're matched to an existing pending enrollment by email.
   */
  registrationFeeAmount: integer("registration_fee_amount"),
  /** Running total of paid (successful) payments, in paise. */
  amountPaid: integer("amount_paid").notNull().default(0),
  status: enrollmentStatusEnum("status").notNull().default("pending"),
  /** Whether the 60-days-post-enrollment statement invoice has already gone out — prevents resending it on every sweep run. */
  day60InvoiceSent: boolean("day60_invoice_sent").notNull().default(false),
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

export const demoRequests = pgTable("demo_requests", {
  id: serial("id").primaryKey(),
  candidateName: varchar("candidate_name", { length: 255 }).notNull(),
  candidateEmail: varchar("candidate_email", { length: 255 }).notNull(),
  candidatePhone: varchar("candidate_phone", { length: 32 }).notNull(),
  programSlug: varchar("program_slug", { length: 64 }).notNull(),
  contacted: boolean("contacted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const blogSeries = pgTable("blog_series", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  /** Groups weekly posts under a registered series — null for a standalone post. */
  seriesId: integer("series_id").references(() => blogSeries.id),
  /** This post's position within its series — purely for display ordering, independent of publish date. */
  seriesPart: integer("series_part"),
  excerpt: text("excerpt"),
  /** Sanitized HTML from the admin rich-text editor. */
  contentHtml: text("content_html").notNull(),
  coverImageUrl: text("cover_image_url"),
  author: varchar("author", { length: 120 }),
  status: blogPostStatusEnum("status").notNull().default("draft"),
  /** Set when a post is first published — used for public ordering and the sitemap, kept even if later unpublished and republished. */
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;
export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type DemoRequest = typeof demoRequests.$inferSelect;
export type NewDemoRequest = typeof demoRequests.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type BlogSeries = typeof blogSeries.$inferSelect;
export type NewBlogSeries = typeof blogSeries.$inferInsert;
