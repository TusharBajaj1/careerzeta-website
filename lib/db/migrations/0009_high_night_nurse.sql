ALTER TYPE "public"."blog_post_status" ADD VALUE 'scheduled' BEFORE 'published';--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "scheduled_at" timestamp with time zone;