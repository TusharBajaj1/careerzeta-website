CREATE TYPE "public"."blog_post_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"series" varchar(150),
	"series_part" integer,
	"excerpt" text,
	"content_html" text NOT NULL,
	"cover_image_url" text,
	"author" varchar(120),
	"status" "blog_post_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
