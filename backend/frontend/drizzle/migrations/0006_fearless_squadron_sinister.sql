DO $$ BEGIN
 CREATE TYPE "public"."joborderTypeStatusEnum" AS ENUM('Available', 'Not Available');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."remark_type_enum" AS ENUM('General', 'Urgent', 'Follow-up', 'Resolved', 'On-Hold', 'Information');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."remarktickets_status" AS ENUM('Open', 'In Progress', 'Resolved', 'Closed', 'Pending', 'Rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."reserveStatusEnum" AS ENUM('Reserved', 'Confirmed', 'Cancelled', 'Pending', 'Completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."salesItemStatusEnum" AS ENUM('Available', 'Out of Stock', 'Discontinued', 'Pending', 'Sold');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."salesitemTypeEnum" AS ENUM('Electronics', 'Furniture', 'Clothing', 'Toys', 'Books', 'Appliances', 'Sporting Goods', 'Groceries', 'Beauty Products', 'Office Supplies');
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
CREATE TABLE IF NOT EXISTS "jobordertype" (
	"joborder_type_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" varchar(255),
	"joborder_types_status" "joborderTypeStatusEnum" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "remarktickets" (
	"remark_id" serial PRIMARY KEY NOT NULL,
	"job_order_id" integer,
	"created_by" integer,
	"remark_type" "remark_type_enum" NOT NULL,
	"description" varchar(255),
	"remarktickets_status" "remarktickets_status" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "borrow" DROP CONSTRAINT "borrow_item_id_item_item_id_fk";
--> statement-breakpoint
ALTER TABLE "joborder" DROP CONSTRAINT "joborder_employee_id_employee_employee_id_fk";
--> statement-breakpoint
ALTER TABLE "sales_items" DROP CONSTRAINT "sales_items_sales_id_sales_sales_id_fk";
--> statement-breakpoint
ALTER TABLE "customer" ALTER COLUMN "socials" SET DATA TYPE jsonb USING socials::jsonb;--> statement-breakpoint
ALTER TABLE "borrow" ADD COLUMN "sales_item_id" integer;--> statement-breakpoint
ALTER TABLE "borrow" ADD COLUMN "fee" integer;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "middlename" varchar(255);--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "item" ADD COLUMN "on_listing" boolean;--> statement-breakpoint
ALTER TABLE "joborder" ADD COLUMN "joborder_type_id" integer;--> statement-breakpoint
ALTER TABLE "joborder" ADD COLUMN "uuid" integer;--> statement-breakpoint
ALTER TABLE "joborder" ADD COLUMN "fee" integer;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "customer_id" integer;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "reports_title" varchar(255);--> statement-breakpoint
ALTER TABLE "reserve" ADD COLUMN "item_id" integer;--> statement-breakpoint
ALTER TABLE "reserve" ADD COLUMN "reserve_status" "reserveStatusEnum" NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_items" ADD COLUMN "service_id" integer;--> statement-breakpoint
ALTER TABLE "sales_items" ADD COLUMN "sales_item_type" "salesitemTypeEnum" NOT NULL;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "has_sales_item" boolean;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "has_borrow" boolean;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "has_job_order" boolean;--> statement-breakpoint
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
DO $$ BEGIN
 ALTER TABLE "borrow" ADD CONSTRAINT "borrow_sales_item_id_sales_items_sales_item_id_fk" FOREIGN KEY ("sales_item_id") REFERENCES "public"."sales_items"("sales_item_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "joborder" ADD CONSTRAINT "joborder_joborder_type_id_jobordertype_joborder_type_id_fk" FOREIGN KEY ("joborder_type_id") REFERENCES "public"."jobordertype"("joborder_type_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reserve" ADD CONSTRAINT "reserve_item_id_item_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("item_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_items" ADD CONSTRAINT "sales_items_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "borrow" DROP COLUMN IF EXISTS "item_id";--> statement-breakpoint
ALTER TABLE "employee" DROP COLUMN IF EXISTS "uuid";--> statement-breakpoint
ALTER TABLE "joborder" DROP COLUMN IF EXISTS "employee_id";--> statement-breakpoint
ALTER TABLE "joborder" DROP COLUMN IF EXISTS "steps";--> statement-breakpoint
ALTER TABLE "joborder" DROP COLUMN IF EXISTS "required_items";--> statement-breakpoint
ALTER TABLE "sales_items" DROP COLUMN IF EXISTS "sales_id";--> statement-breakpoint
ALTER TABLE "sales_items" DROP COLUMN IF EXISTS "is_service_item";