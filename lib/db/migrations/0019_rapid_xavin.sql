CREATE TABLE "accounting_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"books_closed_through" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
