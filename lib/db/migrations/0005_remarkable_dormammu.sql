ALTER TYPE "public"."enrollment_status" ADD VALUE 'refund_requested' BEFORE 'cancelled';--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "candidate_address" text;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "candidate_gstin" varchar(15);