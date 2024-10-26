DO $$ BEGIN
 CREATE TYPE "public"."tag_item" AS ENUM('New', 'Used', 'Broken');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."approval_status" AS ENUM('Approved', 'Pending', 'Rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."attendance_status" AS ENUM('Present', 'Absent', 'Late', 'Early Leave', 'Paid Leave');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."borrow_status" AS ENUM('Requested', 'Approved', 'Borrowed', 'Returned', 'Overdue', 'Rejected', 'Cancelled', 'Lost', 'Damaged');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."standing" AS ENUM('Active', 'Inactive', 'Pending', 'Suspended', 'Banned', 'VIP', 'Delinquent', 'Prospect');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."employee_status" AS ENUM('Active', 'OnLeave', 'Terminated', 'Resigned', 'Suspended', 'Retired', 'Inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."employee_type" AS ENUM('Regular', 'Probationary', 'Contractual', 'Seasonal', 'Temporary');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."entityTypeEnums" AS ENUM('Employee', 'JobOrder', 'Sales', 'Service', 'Inventory', 'Order');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."gender" AS ENUM('Male', 'Female', 'Others');
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
 CREATE TYPE "public"."joborder_status" AS ENUM('Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled', 'Awaiting Approval', 'Approved', 'Rejected', 'Closed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."joborderTypeStatusEnum" AS ENUM('Available', 'Not Available');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."leave_limit_type" AS ENUM('Sick Leave', 'Vacation Leave', 'Personal Leave');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."leave_request_type" AS ENUM('Sick Leave', 'Vacation Leave', 'Personal Leave');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."order_status" AS ENUM('Pending', 'Processing', 'Delivered', 'Cancelled', 'Return', 'Shipped');
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
 CREATE TYPE "public"."payroll_frequency" AS ENUM('Daily', 'Weekly', 'Bi Weekly', 'Semi Monthly', 'Monthly');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payroll_status" AS ENUM('Active', 'Inactive', 'Inprogress');
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
 CREATE TYPE "public"."salesitemTypeEnum" AS ENUM('Sales', 'Joborder', 'Borrow', 'Purchase', 'Exchange');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."sender_type" AS ENUM('User', 'Admin', 'Customer Support', 'Supplier', 'Employee', 'Manager');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."service_status" AS ENUM('Active', 'Inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "additional_pay" (
	"additional_pay_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"name" varchar(255),
	"additional_pay_type" varchar(255),
	"amount" real,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "adjustments" (
	"adjustments_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"name" varchar(255),
	"remarks" varchar(255),
	"adjustments_type" varchar(255),
	"amount" real,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "arrived_items" (
	"arrived_Items_id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"filePath" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
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
CREATE TABLE IF NOT EXISTS "attendance" (
	"attendance_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"date" varchar,
	"clock_in" varchar,
	"clock_out" varchar,
	"hoursWorked" real,
	"attendance_status" "attendance_status" NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auditLog" (
	"auditlog_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"entity_id" integer,
	"entity_type" "entityTypeEnums" NOT NULL,
	"action" varchar(255),
	"change" jsonb,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "benefits" (
	"benefits_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"name" varchar(255),
	"start" date,
	"end" date,
	"frequency" varchar,
	"benefits_type" varchar(255),
	"amount" real,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "borrow" (
	"borrow_id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"sales_item_id" integer,
	"borrow_date" varchar,
	"return_date" varchar,
	"fee" integer,
	"borrow_status" "borrow_status" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"content" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channel" (
	"channel_id" serial PRIMARY KEY NOT NULL,
	"inquiry_id" integer,
	"channel_name" varchar(255),
	"is_private" boolean,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
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
	"standing" "standing" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deductions" (
	"deduction_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"name" varchar(255),
	"start" varchar,
	"end" varchar,
	"frequency" varchar,
	"deduction_type" varchar(255),
	"amount" real,
	"description" varchar(255),
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
	"firstname" varchar(255),
	"middlename" varchar(255),
	"lastname" varchar(255),
	"email" varchar(255),
	"status" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employment_info" (
	"employment_information_id" serial PRIMARY KEY NOT NULL,
	"hireDate" timestamp DEFAULT now(),
	"department_id" integer,
	"designation_id" integer,
	"employee_type" "employee_type" NOT NULL,
	"employee_status" "employee_status" NOT NULL,
	"message" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "financial_info" (
	"financial_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"pag_ibig_id" varchar(255),
	"sss_id" varchar(255),
	"philhealth_id" varchar(255),
	"tin" varchar(255),
	"bank_account_number" varchar(255),
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
CREATE TABLE IF NOT EXISTS "item" (
	"item_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"stock" integer,
	"price" numeric(10, 2),
	"on_listing" boolean,
	"re_order_level" integer,
	"tag" "tag_item",
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "joborder" (
	"job_order_id" serial PRIMARY KEY NOT NULL,
	"joborder_type_id" integer,
	"service_id" integer,
	"uuid" varchar(255),
	"fee" integer,
	"joborder_status" "joborder_status" NOT NULL,
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
	"fee" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leave_limit" (
	"leave_limit_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"limit_count" real DEFAULT 10.1,
	"leave_limit_type" "leave_limit_type" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leave_request" (
	"leave_request_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"title" varchar(255),
	"content" varchar(255),
	"date_of_leave" varchar,
	"date_of_return" varchar,
	"status" varchar(255),
	"comment" varchar(255),
	"leave_request_type" "leave_request_type" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "message" (
	"message_id" serial PRIMARY KEY NOT NULL,
	"inquiry_id" integer,
	"sender_id" integer,
	"sender_type" "sender_type" NOT NULL,
	"content" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "on_payroll" (
	"on_payroll_id" serial PRIMARY KEY NOT NULL,
	"payroll_id" integer,
	"employee_id" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"order_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"items_ordered" integer,
	"expected_arrival" varchar,
	"order_status" "order_status" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orderItem" (
	"orderItem_id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"product_id" integer,
	"quantity" integer,
	"price" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "participants" (
	"participants_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"channel_id" integer,
	"is_private" boolean,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"total_price" real,
	"payment_date" varchar,
	"payment_method" "payment_method" NOT NULL,
	"payment_status" "payment_status" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payroll" (
	"payroll_id" serial PRIMARY KEY NOT NULL,
	"start" varchar,
	"end" varchar,
	"pay_date" varchar,
	"payroll_finished" varchar,
	"signatory_id" integer,
	"payroll_status" "payroll_status",
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payroll_approval" (
	"payroll_approval_id" serial PRIMARY KEY NOT NULL,
	"on_payroll_id" integer,
	"approval_status" "approval_status" NOT NULL,
	"approval_date" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payroll_reports" (
	"payroll_report" serial PRIMARY KEY NOT NULL,
	"on_payroll_id" integer,
	"netpay" real,
	"grosspay" real,
	"total_deductions" real,
	"total_benefits" real,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "personal_info" (
	"personal_information_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"birthday" varchar(255),
	"gender" "gender",
	"phone" varchar(255),
	"email" varchar(255),
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
CREATE TABLE IF NOT EXISTS "product" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"supplier_id" integer,
	"name" varchar(255),
	"description" varchar(255),
	"price" real,
	"img_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_attachment" (
	"product_attachment_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"filePath" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "receipt" (
	"receipt_id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"payment_id" integer,
	"issued_data" varchar,
	"total_price" real,
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
CREATE TABLE IF NOT EXISTS "reports" (
	"reports_id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
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
	"service_id" integer,
	"item_id" integer,
	"reserve_status" "reserveStatusEnum" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "salary_info" (
	"salary_information_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"payroll_frequency" "payroll_frequency" NOT NULL,
	"base_salary" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales_items" (
	"sales_item_id" serial PRIMARY KEY NOT NULL,
	"item_id" integer,
	"service_id" integer,
	"quantity" integer,
	"sales_item_type" "salesitemTypeEnum" NOT NULL,
	"total_price" numeric(50, 2),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service" (
	"service_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"customer_id" integer,
	"service_title" varchar(255),
	"service_description" varchar(255),
	"service_status" "service_status",
	"has_reservation" boolean,
	"has_sales_item" boolean,
	"has_borrow" boolean,
	"has_job_order" boolean,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "signatory" (
	"signatory_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"signatory_name" varchar(255),
	"role" varchar(255),
	"permission_level" integer,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_logs" (
	"stock_logs_id" serial PRIMARY KEY NOT NULL,
	"item_id" integer,
	"quantity" integer,
	"movement_type" varchar,
	"action" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplier" (
	"supplier_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"contact_number" varchar(255),
	"remarks" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "additional_pay" ADD CONSTRAINT "additional_pay_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "adjustments" ADD CONSTRAINT "adjustments_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "arrived_items" ADD CONSTRAINT "arrived_items_order_id_order_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
 ALTER TABLE "attendance" ADD CONSTRAINT "attendance_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auditLog" ADD CONSTRAINT "auditLog_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "benefits" ADD CONSTRAINT "benefits_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "borrow" ADD CONSTRAINT "borrow_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "channel" ADD CONSTRAINT "channel_inquiry_id_inquiry_inquiry_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."inquiry"("inquiry_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deductions" ADD CONSTRAINT "deductions_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "financial_info" ADD CONSTRAINT "financial_info_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "item" ADD CONSTRAINT "item_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "joborder" ADD CONSTRAINT "joborder_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leave_limit" ADD CONSTRAINT "leave_limit_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leave_request" ADD CONSTRAINT "leave_request_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_inquiry_id_inquiry_inquiry_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."inquiry"("inquiry_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "on_payroll" ADD CONSTRAINT "on_payroll_payroll_id_payroll_payroll_id_fk" FOREIGN KEY ("payroll_id") REFERENCES "public"."payroll"("payroll_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "on_payroll" ADD CONSTRAINT "on_payroll_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_order_id_order_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "participants" ADD CONSTRAINT "participants_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "participants" ADD CONSTRAINT "participants_channel_id_channel_channel_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channel"("channel_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment" ADD CONSTRAINT "payment_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payroll" ADD CONSTRAINT "payroll_signatory_id_signatory_signatory_id_fk" FOREIGN KEY ("signatory_id") REFERENCES "public"."signatory"("signatory_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payroll_approval" ADD CONSTRAINT "payroll_approval_on_payroll_id_on_payroll_on_payroll_id_fk" FOREIGN KEY ("on_payroll_id") REFERENCES "public"."on_payroll"("on_payroll_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payroll_reports" ADD CONSTRAINT "payroll_reports_on_payroll_id_on_payroll_on_payroll_id_fk" FOREIGN KEY ("on_payroll_id") REFERENCES "public"."on_payroll"("on_payroll_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "product" ADD CONSTRAINT "product_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_supplier_id_supplier_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("supplier_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_attachment" ADD CONSTRAINT "product_attachment_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "receipt" ADD CONSTRAINT "receipt_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "reports" ADD CONSTRAINT "reports_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_job_order_id_joborder_job_order_id_fk" FOREIGN KEY ("job_order_id") REFERENCES "public"."joborder"("job_order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reserve" ADD CONSTRAINT "reserve_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "salary_info" ADD CONSTRAINT "salary_info_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_items" ADD CONSTRAINT "sales_items_item_id_item_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("item_id") ON DELETE no action ON UPDATE no action;
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
DO $$ BEGIN
 ALTER TABLE "service" ADD CONSTRAINT "service_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service" ADD CONSTRAINT "service_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signatory" ADD CONSTRAINT "signatory_employee_id_employee_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_logs" ADD CONSTRAINT "stock_logs_item_id_item_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("item_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
