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
 CREATE TYPE "public"."discount_type" AS ENUM('Percentage Discount', 'Fixed Amount Discount', 'BOGO (Buy x, Get y Free)', 'Bulk Discount', 'Seasonal Discount', 'Clearance Sale', 'Loyalty Discount', 'First-Time Buyer Discount', 'Referral Discount', 'Birthday Discount', 'Employee Discount', 'Cash Payment', 'Coupon');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."order_status" AS ENUM('Waiting for Arrival', 'Pending', 'Delivered', 'Returned', 'Pending Payment', 'Cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."product_status" AS ENUM('Unavailable', 'Available');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."record_condition" AS ENUM('New', 'Secondhand', 'Broken');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."record_status" AS ENUM('Sold', 'Pending Payment', 'On Order', 'In Service', 'Awaiting Service', 'Return Requested');
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
 CREATE TYPE "public"."serial_status" AS ENUM('Sold', 'Pending Payment', 'On Order', 'In Service', 'Awaiting Service', 'Return Requested');
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
 CREATE TYPE "public"."payment_status" AS ENUM('Pending', 'Completed', 'Failed', 'Cancelled', 'Refunded', 'Partially Refunded', 'Overdue', 'Processing', 'Declined', 'Authorized');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."service_type" AS ENUM('Borrow', 'Reservation', 'Sales', 'Joborder');
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
 CREATE TYPE "public"."sales_item_type" AS ENUM('Sales', 'Job Order', 'Borrow', 'Purchase');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."borrow_status" AS ENUM('Borrowed', 'Confirmed', 'Cancelled', 'Pending', 'Completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."borrowStatusEnum" AS ENUM('Requested', 'Approved', 'Borrowed', 'Returned', 'Overdue', 'Rejected', 'Cancelled', 'Lost', 'Damaged');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."joborder_status" AS ENUM('Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled', 'Awaiting Approval', 'Approved', 'Rejected', 'Closed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."remarktickets_status" AS ENUM('Resolved', 'Pending', 'Removed');
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
CREATE TABLE IF NOT EXISTS "discount" (
	"discount_id" serial PRIMARY KEY NOT NULL,
	"discount_name" varchar,
	"discount_type" "discount_type" NOT NULL,
	"discoun_value" real,
	"coupon_code" varchar,
	"is_single_use" boolean,
	"max_redemption" integer,
	"start_date" timestamp,
	"end_date" timestamp,
	"is_active" boolean,
	"min_purchase_amount" real,
	"max_discount_amount" real,
	"usage_limit" integer,
	"time_used" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "discount_c" (
	"discount_c_id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"customer_group" integer,
	"discount_id" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "discount_p" (
	"discount_p_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"discount_id" integer,
	"categor_id" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"order_id" serial PRIMARY KEY NOT NULL,
	"supplier_id" integer,
	"ordered_value" integer,
	"expected_arrival" varchar,
	"message" varchar,
	"status" "order_status",
	"order_total" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_product" (
	"order_product_id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"product_id" integer,
	"quantity" integer DEFAULT 1,
	"price" numeric(50, 2),
	"status" varchar,
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
	"qty" integer DEFAULT 0,
	"price" real DEFAULT 0,
	"type" "record_condition" NOT NULL,
	"status" "record_status" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serialized_product" (
	"serial_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"supplier_id" integer,
	"serial_number" varchar NOT NULL,
	"warranty_date" timestamp,
	"external_serial_code" varchar(255),
	"external_warranty_date" varchar,
	"price" real DEFAULT 0,
	"type" "serial_condition" NOT NULL,
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
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "couponredemptions" (
	"couponredemptions_id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"discount_id" integer,
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
CREATE TABLE IF NOT EXISTS "product_pricing" (
	"p_pricing_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"serial_id" integer,
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
	"job_order_id" integer,
	"borrow_id" integer,
	"sales_id" integer,
	"service_type" "service_type" NOT NULL,
	"total_price" real,
	"vat_rate" real,
	"discount_id" integer,
	"payment_date" varchar,
	"payment_method" "payment_method" NOT NULL,
	"payment_status" "payment_status" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "receipt" (
	"receipt_id" serial PRIMARY KEY NOT NULL,
	"payment_id" integer,
	"issued_data" varchar,
	"total_amount" integer,
	"receipt_dl_link" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales" (
	"sales_id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"sales_status" "sales_status" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales_items" (
	"sales_item_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"sales_id" integer,
	"quantity" integer,
	"salesItem_type" "sales_item_type",
	"total_price" real,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assigned_employees" (
	"assigned_employee_id" serial PRIMARY KEY NOT NULL,
	"job_order_id" integer,
	"employee_id" integer,
	"is_leader" boolean,
	"assigned_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "borrow" (
	"borrow_id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"borrow_date" varchar,
	"return_date" varchar,
	"fee" integer,
	"borrow_status" "borrow_status" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "borrow_items" (
	"borrow_item_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"borrow_id" integer,
	"borrow_date" date,
	"fee" integer,
	"borrow_item_status" "borrowStatusEnum" NOT NULL,
	"return_date" date,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_order" (
	"job_order_id" serial PRIMARY KEY NOT NULL,
	"joborder_type_id" integer,
	"customer_id" integer,
	"uuid" varchar(255),
	"description" varchar,
	"fee" integer,
	"joborder_status" "joborder_status" NOT NULL,
	"total_cost_price" real,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_order_items" (
	"job_order_item_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"job_order_id" integer,
	"status" varchar,
	"quantity" real,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_order_type" (
	"joborder_type_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "remark_tickets" (
	"remark_id" serial PRIMARY KEY NOT NULL,
	"remark_type_id" integer,
	"job_order_id" integer,
	"title" varchar,
	"description" varchar(255),
	"content" varchar,
	"remark_tickets_status" "remarktickets_status" NOT NULL,
	"deadline" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "remark_type" (
	"remark_type_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"reports_id" serial PRIMARY KEY NOT NULL,
	"job_order_id" integer,
	"reports_title" varchar(255),
	"remarks" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reserve" (
	"reserve_id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"reserve_status" "reserveStatusEnum" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reserve_items" (
	"reserve_item_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"reserve_id" integer,
	"expiration_date" timestamp DEFAULT now(),
	"reserve_item_status" "reserveStatusEnum" NOT NULL,
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
 ALTER TABLE "discount_c" ADD CONSTRAINT "discount_c_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "discount_c" ADD CONSTRAINT "discount_c_customer_group_customer_group_customer_group_id_fk" FOREIGN KEY ("customer_group") REFERENCES "public"."customer_group"("customer_group_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "discount_c" ADD CONSTRAINT "discount_c_discount_id_discount_discount_id_fk" FOREIGN KEY ("discount_id") REFERENCES "public"."discount"("discount_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "discount_p" ADD CONSTRAINT "discount_p_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "discount_p" ADD CONSTRAINT "discount_p_discount_id_discount_discount_id_fk" FOREIGN KEY ("discount_id") REFERENCES "public"."discount"("discount_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "discount_p" ADD CONSTRAINT "discount_p_categor_id_category_category_id_fk" FOREIGN KEY ("categor_id") REFERENCES "public"."category"("category_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "couponredemptions" ADD CONSTRAINT "couponredemptions_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "couponredemptions" ADD CONSTRAINT "couponredemptions_discount_id_discount_discount_id_fk" FOREIGN KEY ("discount_id") REFERENCES "public"."discount"("discount_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "product_pricing" ADD CONSTRAINT "product_pricing_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_pricing" ADD CONSTRAINT "product_pricing_serial_id_serialized_product_serial_id_fk" FOREIGN KEY ("serial_id") REFERENCES "public"."serialized_product"("serial_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "payment" ADD CONSTRAINT "payment_job_order_id_job_order_job_order_id_fk" FOREIGN KEY ("job_order_id") REFERENCES "public"."job_order"("job_order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment" ADD CONSTRAINT "payment_borrow_id_borrow_borrow_id_fk" FOREIGN KEY ("borrow_id") REFERENCES "public"."borrow"("borrow_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment" ADD CONSTRAINT "payment_sales_id_sales_sales_id_fk" FOREIGN KEY ("sales_id") REFERENCES "public"."sales"("sales_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment" ADD CONSTRAINT "payment_discount_id_discount_discount_id_fk" FOREIGN KEY ("discount_id") REFERENCES "public"."discount"("discount_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "receipt" ADD CONSTRAINT "receipt_payment_id_payment_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("payment_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "assigned_employees" ADD CONSTRAINT "assigned_employees_job_order_id_job_order_job_order_id_fk" FOREIGN KEY ("job_order_id") REFERENCES "public"."job_order"("job_order_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "borrow" ADD CONSTRAINT "borrow_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "borrow_items" ADD CONSTRAINT "borrow_items_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "borrow_items" ADD CONSTRAINT "borrow_items_borrow_id_borrow_borrow_id_fk" FOREIGN KEY ("borrow_id") REFERENCES "public"."borrow"("borrow_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_order" ADD CONSTRAINT "job_order_joborder_type_id_job_order_type_joborder_type_id_fk" FOREIGN KEY ("joborder_type_id") REFERENCES "public"."job_order_type"("joborder_type_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_order" ADD CONSTRAINT "job_order_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_order_items" ADD CONSTRAINT "job_order_items_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_order_items" ADD CONSTRAINT "job_order_items_job_order_id_job_order_job_order_id_fk" FOREIGN KEY ("job_order_id") REFERENCES "public"."job_order"("job_order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "remark_tickets" ADD CONSTRAINT "remark_tickets_remark_type_id_remark_type_remark_type_id_fk" FOREIGN KEY ("remark_type_id") REFERENCES "public"."remark_type"("remark_type_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "remark_tickets" ADD CONSTRAINT "remark_tickets_job_order_id_job_order_job_order_id_fk" FOREIGN KEY ("job_order_id") REFERENCES "public"."job_order"("job_order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_job_order_id_job_order_job_order_id_fk" FOREIGN KEY ("job_order_id") REFERENCES "public"."job_order"("job_order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reserve" ADD CONSTRAINT "reserve_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reserve_items" ADD CONSTRAINT "reserve_items_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reserve_items" ADD CONSTRAINT "reserve_items_reserve_id_reserve_reserve_id_fk" FOREIGN KEY ("reserve_id") REFERENCES "public"."reserve"("reserve_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
