ALTER TYPE "public"."payment_type" ADD VALUE 'installment';--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "installment_number" integer;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "installment_total" integer;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "due_date" timestamp with time zone;