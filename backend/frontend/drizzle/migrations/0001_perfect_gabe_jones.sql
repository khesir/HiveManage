DO $$ BEGIN
 CREATE TYPE "public"."tag_item" AS ENUM('New', 'Used', 'Broken');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "item" ADD COLUMN "tag" "tag_item";--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "img_url" varchar;