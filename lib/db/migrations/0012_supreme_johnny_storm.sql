ALTER TABLE "enrollments" ADD COLUMN "admission_letter_sent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "admission_letter_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "admission_letter_pdf_url" text;