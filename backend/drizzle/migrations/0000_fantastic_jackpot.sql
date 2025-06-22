DO $$ BEGIN
 CREATE TYPE "public"."customer_standing" AS ENUM('Active', 'Inactive', 'Pending', 'Suspended', 'Banned', 'VIP', 'Delinquent', 'Prospect');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."inquiry_type" AS ENUM('Product', 'Pricing', 'Order Status', 'Technical Support', 'Billing', 'Complaint', 'Feedback', 'Return/Refund');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."employmentInfo_Status" AS ENUM('Active', 'On Leave', 'Terminated', 'Resigned', 'Suspended', 'Retired', 'Inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."employmentInfo_Type" AS ENUM('Regular', 'Probationary', 'Contractual', 'Seasonal', 'Temporary');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."order_status" AS ENUM('Draft', 'Finalized', 'Awaiting Arrival', 'Partially Fulfiled', 'Fulfilled', 'Cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."order_payment_method" AS ENUM('Cash', 'Credit Card', 'Bank Transfer', 'Check', 'Digital Wallet');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."order_payment_status" AS ENUM('Pending', 'Partially Paid', 'Paid');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('Draft', 'Finalized', 'Awaiting Arrival', 'Partially Delivered', 'Delivered', 'Cancelled', 'Returned', 'Partially Stocked', 'Stocked');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."order_log_action_type" AS ENUM('Added to inventory', 'Resolved', 'Delivered', 'Ordered', 'Returned');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."order_log_status" AS ENUM('Delivered', 'Pending', 'Resolved', 'Approved', 'Refunded');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."resolve_type_enum" AS ENUM('Replaced', 'Refunded', 'Discounted', 'Cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."product_status" AS ENUM('Unavailable', 'Available', 'Discontinued');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."product_record_action_type" AS ENUM('Received', 'Returned', 'Transferred', 'Sold');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."product_record_status" AS ENUM('Pending', 'Confirmed', 'Returned', 'Sold', 'Added');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."transfer_source" AS ENUM('Purchase Order', 'Inventory', 'Service', 'Sales');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."purpose_status" AS ENUM('Rent', 'Service', 'Sales');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."serial_condition" AS ENUM('New', 'Secondhand', 'Broken');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."serial_status" AS ENUM('Sold', 'Available', 'Rented', 'Reserve', 'In Service', 'On Order', 'Returned', 'Damage', 'Retired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."supplier_status" AS ENUM('Unavailable', 'Available', 'Discontinued');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."supplierRelation_Status" AS ENUM('manufacturer', 'distributor', 'wholesaler', 'vendor', 'authorized dealer', 'OEM (Original Equipment Manufacturer)', 'peripheral supplier', 'component reseller', 'refurbished parts supplier', 'specialized parts supplier', 'network hardware supplier', 'value-added reseller', 'accessories supplier', 'logistics partner');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_method" AS ENUM('Cash', 'Card', 'Online Payment');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_type" AS ENUM('Service', 'Sales');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."sales_status" AS ENUM('Completed', 'Partially Completed', 'Cancelled', 'Pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."sales_resolve_type_enum" AS ENUM('Refunded', 'Replaced', 'Discounted', 'Cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."sales_log_action_type" AS ENUM('Sold', 'Returned', 'Restocked', 'Refunded', 'Exchanged');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."sales_log_status" AS ENUM('Completed', 'Pending', 'Refunded', 'Partial Return', 'Resolved');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."joborder_status" AS ENUM('In Progress', 'Pending', 'Completed', 'Turned Over', 'Cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."service_status" AS ENUM('Cancelled', 'In Progress', 'Pending', 'Completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."service_item_status" AS ENUM('Pending', 'Used', 'Sold', 'Returned');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."tickets_status" AS ENUM('Pending', 'In Review', 'Approved', 'Rejected', 'Assigned', 'In Progress', 'On Hold', 'Completed', 'Cancelled', 'Closed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."reserve_details_status" AS ENUM('Pending', 'Confirmed', 'Cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer" (
	"customer_id" serial PRIMARY KEY NOT NULL,
	"firstname" varchar(255),
	"middlename" varchar(255),
	"lastname" varchar(255),
	"contact_phone" varchar(255),
	"socials" jsonb DEFAULT '[]'::jsonb,
	"address_line" varchar(255),
	"barangay" varchar(255),
	"province" varchar(255),
	"email" varchar(255),
	"customer_standing" "customer_standing" NOT NULL,
	"customer_group" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_group" (
	"customer_group_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inquiry" (
	"inquiry_id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"inquiryTitle" varchar(255),
	"inquiry_type" "inquiry_type" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "department" (
	"department_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"status" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "designation" (
	"designation_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"status" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee" (
	"employee_id" serial PRIMARY KEY NOT NULL,
	"position_id" integer,
	"firstname" varchar(255),
	"middlename" varchar(255),
	"lastname" varchar(255),
	"email" varchar(255) NOT NULL,
	"profile_link" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "employee_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee_roles" (
	"employee_roles_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"role_id" integer,
	"user_id" varchar,
	"status" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employment_info" (
	"employment_info_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"hireDate" varchar,
	"department_id" integer,
	"designation_id" integer,
	"employee_type" varchar,
	"employee_status" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "personal_info" (
	"personal_info_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"birthday" varchar(255),
	"sex" varchar,
	"phone" varchar(255),
	"address_line" varchar(255),
	"postal_code" varchar(255),
	"emergency_contact_name" varchar(255),
	"emergency_contact_phone" varchar(255),
	"emergency_contact_relationship" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "position" (
	"position_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"role_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"order_id" serial PRIMARY KEY NOT NULL,
	"supplier_id" integer,
	"notes" varchar,
	"expected_arrival" timestamp,
	"order_status" "order_status",
	"order_payment_status" "order_payment_status",
	"order_payment_method" "order_payment_method",
	"delivery_receipt" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_product" (
	"order_product_id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"product_id" integer,
	"total_quantity" integer NOT NULL,
	"ordered_quantity" integer DEFAULT 0,
	"delivered_quantity" integer DEFAULT 0,
	"resolved_quantity" integer DEFAULT 0,
	"unit_price" numeric(50, 2),
	"status" "status" DEFAULT 'Draft',
	"is_serialize" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"img_url" varchar,
	"is_serialize" boolean DEFAULT false,
	"product_status" "product_status" NOT NULL,
	"re_order_level" integer DEFAULT 0,
	"selling_price" numeric(50, 2),
	"total_quantity" integer DEFAULT 0 NOT NULL,
	"sale_quantity" integer DEFAULT 0,
	"service_quantity" integer DEFAULT 0,
	"rent_quantity" integer DEFAULT 0,
	"damage_quantity" integer DEFAULT 0,
	"sold_quantity" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_details" (
	"p_details_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"description" varchar(255),
	"color" varchar,
	"size" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_record" (
	"product_record_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"supplier_id" integer,
	"order_item_id" integer,
	"quantity" integer DEFAULT 0,
	"status" "product_record_status" NOT NULL,
	"action_type" "product_record_action_type" NOT NULL,
	"employee_id" integer,
	"source" "transfer_source",
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serialized_product" (
	"serial_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"supplier_id" integer,
	"serial_code" varchar(255),
	"warranty_date" varchar,
	"type" "serial_condition" NOT NULL,
	"purpose" "purpose_status" DEFAULT 'Sales' NOT NULL,
	"status" "serial_status" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplier" (
	"supplier_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"contact_number" varchar(255),
	"remarks" varchar(255),
	"relationship" "supplierRelation_Status",
	"profile_link" varchar,
	"supplier_status" "supplier_status" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_log" (
	"order_log_id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"order_item_id" integer,
	"product_id" integer,
	"total_quantity" integer NOT NULL,
	"ordered_quantity" integer DEFAULT 0,
	"delivered_quantity" integer DEFAULT 0,
	"resolved_quantity" integer DEFAULT 0,
	"status" "order_log_status",
	"action_type" "order_log_action_type",
	"resolve_type" "resolve_type_enum",
	"performed_by" integer,
	"notes" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_category" (
	"p_category_id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"product_id" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_supplier" (
	"p_supplier_id" serial PRIMARY KEY NOT NULL,
	"supplier_id" integer,
	"product_id" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"total_price" real,
	"paid_amount" real DEFAULT 0,
	"change_amount" real DEFAULT 0,
	"vat_amount" real DEFAULT 0,
	"discount_amount" integer DEFAULT 0,
	"payment_date" varchar,
	"payment_method" "payment_method" NOT NULL,
	"payment_type" "payment_type" NOT NULL,
	"is_refund" boolean DEFAULT false,
	"related_payment_id" integer,
	"reference_number" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProductTransLog" (
	"product_log_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"product_record_id" integer,
	"serial_id" integer,
	"action" varchar(255),
	"quantity" integer,
	"performed_by" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employeeLog" (
	"employee_logs_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"action" varchar(255),
	"performed_by" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "joborder_Log" (
	"product_log_id" serial PRIMARY KEY NOT NULL,
	"joborder_id" integer,
	"action" varchar(255),
	"performed_by" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serviceLog" (
	"service_log_id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"action" varchar(255),
	"performed_by" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales" (
	"sales_id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"payment_id" integer,
	"sales_status" "sales_status" NOT NULL,
	"handled_by" integer,
	"product_sold" integer,
	"total_price" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales_items" (
	"sales_item_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"sales_id" integer,
	"serialize_items" integer[] DEFAULT '{}'::integer[],
	"sold_price" integer,
	"quantity" integer,
	"return_qty" integer DEFAULT 0,
	"refund_amount" real DEFAULT 0,
	"return_note" varchar,
	"warranty_date" timestamp,
	"warranty_used" boolean,
	"warranty_claimed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales_log" (
	"sales_log_id" serial PRIMARY KEY NOT NULL,
	"sales_id" integer,
	"sale_item_id" integer,
	"product_id" integer,
	"total_quantity" integer NOT NULL,
	"returned_quantity" integer DEFAULT 0,
	"restocked_quantity" integer DEFAULT 0,
	"refunded_amount" numeric(10, 2) DEFAULT '0.00',
	"status" "sales_log_status",
	"action_type" "sales_log_action_type",
	"resolve_type" "sales_resolve_type_enum",
	"notes" varchar(255),
	"performed_by" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assigned_employees" (
	"assigned_employee_id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"employee_id" integer,
	"is_leader" boolean,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assigned_ticket" (
	"assigned_ticket_id" serial PRIMARY KEY NOT NULL,
	"ticket_id" integer,
	"employee_id" integer,
	"service_id" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service" (
	"service_id" serial PRIMARY KEY NOT NULL,
	"service_type_id" integer,
	"joborder_id" integer,
	"uuid" varchar NOT NULL,
	"fee" integer,
	"service_status" "service_status" NOT NULL,
	"total_cost_price" integer,
	"is_returned" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_Type" (
	"service_type_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"customizable_fee" real,
	"description" varchar(255),
	"duration" varchar,
	"is_activate" boolean,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ticketType" (
	"ticket_type_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tickets" (
	"ticket_id" serial PRIMARY KEY NOT NULL,
	"ticket_type_id" integer,
	"service_id" integer,
	"title" varchar,
	"description" varchar(255),
	"content" varchar,
	"ticket_status" "tickets_status" NOT NULL,
	"deadline" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "joborder" (
	"joborder_id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"payment_id" integer,
	"joborder_uuid" varchar,
	"expected_completion_data" timestamp,
	"completed_at" timestamp,
	"turned_over_at" timestamp,
	"status" "joborder_status",
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "joborder_joborder_uuid_unique" UNIQUE("joborder_uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_item" (
	"service_item_id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"product_id" integer,
	"serialize_items" integer[] DEFAULT '{}'::integer[],
	"sold_price" integer,
	"quantity" integer,
	"status" "service_item_status",
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_owned_items" (
	"service_owned_id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"name" varchar,
	"item_description" varchar,
	"serial_number" varchar,
	"brand" varchar,
	"model" varchar,
	"notes " varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_return" (
	"return_id" serial PRIMARY KEY NOT NULL,
	"original_service_id" integer,
	"new_service_id" integer,
	"reason" varchar,
	"under_warranty" boolean,
	"returned_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "build_details" (
	"build_id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"customer_items" integer[] DEFAULT '{}'::integer[],
	"parts_used" integer[] DEFAULT '{}'::integer[],
	"build_specs" varchar,
	"checklist" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cleaning_details" (
	"cleaning_id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"method" varchar,
	"notes" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rent_details" (
	"rent_id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"rented_items" integer[] DEFAULT '{}'::integer[],
	"start_date" timestamp,
	"end_date" timestamp,
	"deposit" real,
	"returned" boolean,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "repair_details" (
	"repair_details_id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"parts_used" integer[] DEFAULT '{}'::integer[],
	"diagnostic_notes" varchar,
	"work_done" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "replacement_details" (
	"replacement_id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"owned_items" integer[] DEFAULT '{}'::integer[],
	"new_product" integer[] DEFAULT '{}'::integer[],
	"reason" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reserve_details" (
	"reserve_id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"reserve_item_id" integer[] DEFAULT '{}'::integer[],
	"reservation_date" timestamp,
	"status" "reserve_details_status",
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "upgrade_details" (
	"upgrade_id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"before_specs" integer[] DEFAULT '{}'::integer[],
	"upgraded_components" integer[] DEFAULT '{}'::integer[],
	"notes" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer" ADD CONSTRAINT "customer_customer_group_customer_group_customer_group_id_fk" FOREIGN KEY ("customer_group") REFERENCES "public"."customer_group"("customer_group_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inquiry" ADD CONSTRAINT "inquiry_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee" ADD CONSTRAINT "employee_position_id_position_position_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."position"("position_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee_roles" ADD CONSTRAINT "employee_roles_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee_roles" ADD CONSTRAINT "employee_roles_role_id_roles_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("role_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employment_info" ADD CONSTRAINT "employment_info_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employment_info" ADD CONSTRAINT "employment_info_department_id_department_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."department"("department_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employment_info" ADD CONSTRAINT "employment_info_designation_id_designation_designation_id_fk" FOREIGN KEY ("designation_id") REFERENCES "public"."designation"("designation_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "personal_info" ADD CONSTRAINT "personal_info_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_supplier_id_supplier_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("supplier_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_product" ADD CONSTRAINT "order_product_order_id_order_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_product" ADD CONSTRAINT "order_product_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_details" ADD CONSTRAINT "product_details_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_record" ADD CONSTRAINT "product_record_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_record" ADD CONSTRAINT "product_record_supplier_id_supplier_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("supplier_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_record" ADD CONSTRAINT "product_record_order_item_id_order_product_order_product_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_product"("order_product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_record" ADD CONSTRAINT "product_record_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serialized_product" ADD CONSTRAINT "serialized_product_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serialized_product" ADD CONSTRAINT "serialized_product_supplier_id_supplier_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("supplier_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_log" ADD CONSTRAINT "order_log_order_id_order_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_log" ADD CONSTRAINT "order_log_order_item_id_order_product_order_product_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_product"("order_product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_log" ADD CONSTRAINT "order_log_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_log" ADD CONSTRAINT "order_log_performed_by_employee_employee_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_category" ADD CONSTRAINT "product_category_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_category" ADD CONSTRAINT "product_category_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_supplier" ADD CONSTRAINT "product_supplier_supplier_id_supplier_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("supplier_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_supplier" ADD CONSTRAINT "product_supplier_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ProductTransLog" ADD CONSTRAINT "ProductTransLog_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ProductTransLog" ADD CONSTRAINT "ProductTransLog_product_record_id_product_record_product_record_id_fk" FOREIGN KEY ("product_record_id") REFERENCES "public"."product_record"("product_record_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ProductTransLog" ADD CONSTRAINT "ProductTransLog_serial_id_serialized_product_serial_id_fk" FOREIGN KEY ("serial_id") REFERENCES "public"."serialized_product"("serial_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ProductTransLog" ADD CONSTRAINT "ProductTransLog_performed_by_employee_employee_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employeeLog" ADD CONSTRAINT "employeeLog_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employeeLog" ADD CONSTRAINT "employeeLog_performed_by_employee_employee_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "joborder_Log" ADD CONSTRAINT "joborder_Log_joborder_id_joborder_joborder_id_fk" FOREIGN KEY ("joborder_id") REFERENCES "public"."joborder"("joborder_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "joborder_Log" ADD CONSTRAINT "joborder_Log_performed_by_employee_employee_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serviceLog" ADD CONSTRAINT "serviceLog_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serviceLog" ADD CONSTRAINT "serviceLog_performed_by_employee_employee_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales" ADD CONSTRAINT "sales_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales" ADD CONSTRAINT "sales_payment_id_payment_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("payment_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales" ADD CONSTRAINT "sales_handled_by_employee_employee_id_fk" FOREIGN KEY ("handled_by") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_items" ADD CONSTRAINT "sales_items_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_items" ADD CONSTRAINT "sales_items_sales_id_sales_sales_id_fk" FOREIGN KEY ("sales_id") REFERENCES "public"."sales"("sales_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_log" ADD CONSTRAINT "sales_log_sales_id_sales_sales_id_fk" FOREIGN KEY ("sales_id") REFERENCES "public"."sales"("sales_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_log" ADD CONSTRAINT "sales_log_sale_item_id_sales_items_sales_item_id_fk" FOREIGN KEY ("sale_item_id") REFERENCES "public"."sales_items"("sales_item_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_log" ADD CONSTRAINT "sales_log_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_log" ADD CONSTRAINT "sales_log_performed_by_employee_employee_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assigned_employees" ADD CONSTRAINT "assigned_employees_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assigned_employees" ADD CONSTRAINT "assigned_employees_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assigned_ticket" ADD CONSTRAINT "assigned_ticket_ticket_id_tickets_ticket_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("ticket_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assigned_ticket" ADD CONSTRAINT "assigned_ticket_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assigned_ticket" ADD CONSTRAINT "assigned_ticket_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service" ADD CONSTRAINT "service_service_type_id_service_Type_service_type_id_fk" FOREIGN KEY ("service_type_id") REFERENCES "public"."service_Type"("service_type_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service" ADD CONSTRAINT "service_joborder_id_joborder_joborder_id_fk" FOREIGN KEY ("joborder_id") REFERENCES "public"."joborder"("joborder_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ticket_type_id_ticketType_ticket_type_id_fk" FOREIGN KEY ("ticket_type_id") REFERENCES "public"."ticketType"("ticket_type_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tickets" ADD CONSTRAINT "tickets_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "joborder" ADD CONSTRAINT "joborder_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "joborder" ADD CONSTRAINT "joborder_payment_id_payment_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("payment_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_item" ADD CONSTRAINT "service_item_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_item" ADD CONSTRAINT "service_item_product_id_service_service_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_owned_items" ADD CONSTRAINT "service_owned_items_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_return" ADD CONSTRAINT "service_return_original_service_id_service_service_id_fk" FOREIGN KEY ("original_service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_return" ADD CONSTRAINT "service_return_new_service_id_service_service_id_fk" FOREIGN KEY ("new_service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "build_details" ADD CONSTRAINT "build_details_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cleaning_details" ADD CONSTRAINT "cleaning_details_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rent_details" ADD CONSTRAINT "rent_details_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "repair_details" ADD CONSTRAINT "repair_details_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "replacement_details" ADD CONSTRAINT "replacement_details_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reserve_details" ADD CONSTRAINT "reserve_details_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "upgrade_details" ADD CONSTRAINT "upgrade_details_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
