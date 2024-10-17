CREATE TABLE IF NOT EXISTS "stock_logs" (
	"stock_logs_id" serial PRIMARY KEY NOT NULL,
	"item_id" integer,
	"quantity" integer,
	"movement_type" varchar,
	"action" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "arrived_Items" RENAME TO "arrived_items";--> statement-breakpoint
ALTER TABLE "arrived_items" DROP CONSTRAINT "arrived_Items_order_id_order_order_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_logs" ADD CONSTRAINT "stock_logs_item_id_item_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("item_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "arrived_items" ADD CONSTRAINT "arrived_items_order_id_order_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
