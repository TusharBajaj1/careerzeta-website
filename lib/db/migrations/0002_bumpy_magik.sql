CREATE TABLE "demo_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_name" varchar(255) NOT NULL,
	"candidate_email" varchar(255) NOT NULL,
	"candidate_phone" varchar(32) NOT NULL,
	"program_slug" varchar(64) NOT NULL,
	"contacted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "registration_fee_amount" integer;