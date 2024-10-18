DO $$ BEGIN
 CREATE TYPE "public"."remark_type_enum" AS ENUM('General', 'Urgent', 'Follow-up', 'Resolved', 'On-Hold', 'Information');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assignedemployees" (
	"assigned_employee_id" serial PRIMARY KEY NOT NULL,
	"job_order_id" integer,
	"employee_id" integer,
	"assigned_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "joborderitems" (
	"joborderitems_id" serial PRIMARY KEY NOT NULL,
	"item_id" integer,
	"job_order_id" integer,
	"quantity" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "remarktickets" (
	"remark_id" serial PRIMARY KEY NOT NULL,
	"job_order_id" integer,
	"remark_type" "remark_type_enum" NOT NULL,
	"created_by" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "joborder" DROP CONSTRAINT "joborder_employee_id_employee_employee_id_fk";
--> statement-breakpoint
ALTER TABLE "item" ADD COLUMN "on_listing" boolean;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assignedemployees" ADD CONSTRAINT "assignedemployees_job_order_id_joborder_job_order_id_fk" FOREIGN KEY ("job_order_id") REFERENCES "public"."joborder"("job_order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assignedemployees" ADD CONSTRAINT "assignedemployees_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "joborderitems" ADD CONSTRAINT "joborderitems_item_id_item_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("item_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "joborderitems" ADD CONSTRAINT "joborderitems_job_order_id_joborder_job_order_id_fk" FOREIGN KEY ("job_order_id") REFERENCES "public"."joborder"("job_order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "remarktickets" ADD CONSTRAINT "remarktickets_job_order_id_joborder_job_order_id_fk" FOREIGN KEY ("job_order_id") REFERENCES "public"."joborder"("job_order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "remarktickets" ADD CONSTRAINT "remarktickets_created_by_employee_employee_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "employee" DROP COLUMN IF EXISTS "uuid";--> statement-breakpoint
ALTER TABLE "joborder" DROP COLUMN IF EXISTS "employee_id";--> statement-breakpoint
ALTER TABLE "joborder" DROP COLUMN IF EXISTS "steps";--> statement-breakpoint
ALTER TABLE "joborder" DROP COLUMN IF EXISTS "required_items";--> statement-breakpoint
ALTER TABLE "sales_items" DROP COLUMN IF EXISTS "is_service_item";