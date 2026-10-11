CREATE SEQUENCE "public"."invoice_number_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "candidate_state" varchar(64);--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "day60_invoice_sent" boolean DEFAULT false NOT NULL;