CREATE TABLE "word_of_the_day" (
	"id" serial PRIMARY KEY NOT NULL,
	"word" varchar(64) NOT NULL,
	"definition" varchar(200) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
