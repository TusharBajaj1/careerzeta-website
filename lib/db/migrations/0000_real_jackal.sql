CREATE TYPE "public"."coupon_status" AS ENUM('active', 'used', 'expired', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."enrollment_status" AS ENUM('pending', 'registration_paid', 'fully_paid', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('created', 'paid', 'failed', 'expired');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('full', 'registration', 'balance');--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(64) NOT NULL,
	"discount_percent" integer,
	"discount_amount" integer,
	"program_slug" varchar(64),
	"candidate_email" varchar(255),
	"candidate_phone" varchar(32),
	"max_uses" integer DEFAULT 1 NOT NULL,
	"used_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone,
	"status" "coupon_status" DEFAULT 'active' NOT NULL,
	"created_by" varchar(128),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_name" varchar(255) NOT NULL,
	"candidate_email" varchar(255) NOT NULL,
	"candidate_phone" varchar(32) NOT NULL,
	"program_slug" varchar(64) NOT NULL,
	"coupon_id" integer,
	"total_fee" integer NOT NULL,
	"amount_paid" integer DEFAULT 0 NOT NULL,
	"status" "enrollment_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"enrollment_id" integer NOT NULL,
	"type" "payment_type" NOT NULL,
	"amount" integer NOT NULL,
	"status" "payment_status" DEFAULT 'created' NOT NULL,
	"razorpay_payment_link_id" varchar(128),
	"razorpay_payment_id" varchar(128),
	"payment_link_url" text,
	"paid_at" timestamp with time zone,
	"invoice_sent" boolean DEFAULT false NOT NULL,
	"invoice_number" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE no action ON UPDATE no action;