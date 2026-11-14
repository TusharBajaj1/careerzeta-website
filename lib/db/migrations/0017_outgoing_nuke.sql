CREATE TYPE "public"."payment_gateway" AS ENUM('razorpay', 'easebuzz');--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "gateway" "payment_gateway" DEFAULT 'razorpay' NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "easebuzz_txn_id" varchar(128);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "easebuzz_payment_id" varchar(128);