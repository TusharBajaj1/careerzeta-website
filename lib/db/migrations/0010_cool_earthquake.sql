ALTER TABLE "payments" ADD COLUMN "invoice_cancelled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "invoice_cancelled_at" timestamp with time zone;