CREATE TABLE `activity_log` (
	`activity_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`action` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `activity_log_activity_id` PRIMARY KEY(`activity_id`)
);
--> statement-breakpoint
CREATE TABLE `additional_pay` (
	`additional_pay_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`additional_pay_type` varchar(255),
	`amount` float,
	`description` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `additional_pay_additional_pay_id` PRIMARY KEY(`additional_pay_id`)
);
--> statement-breakpoint
CREATE TABLE `adjustments` (
	`adjustments_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`remarks` varchar(255),
	`adjustments_type` varchar(255),
	`amount` float,
	`description` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `adjustments_adjustments_id` PRIMARY KEY(`adjustments_id`)
);
--> statement-breakpoint
CREATE TABLE `arrived_Items` (
	`order_id` int,
	`filePath` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`attendance_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`date` date,
	`clock_in` date,
	`clock_out` date,
	`hoursWorked` decimal(10,2),
	`attendance_status` enum('Present','Absent','Late','Early_Leave','Paid_Leave'),
	`description` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `attendance_attendance_id` PRIMARY KEY(`attendance_id`)
);
--> statement-breakpoint
CREATE TABLE `benefits` (
	`benefits_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`start` date,
	`end` date,
	`benefits_type` varchar(255),
	`amount` float,
	`description` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `benefits_benefits_id` PRIMARY KEY(`benefits_id`)
);
--> statement-breakpoint
CREATE TABLE `category` (
	`category_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`content` varchar(255),
	CONSTRAINT `category_category_id` PRIMARY KEY(`category_id`)
);
--> statement-breakpoint
CREATE TABLE `deductions` (
	`deduction_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`start` date,
	`end` date,
	`deduction_type` varchar(255),
	`amount` float,
	`description` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `deductions_deduction_id` PRIMARY KEY(`deduction_id`)
);
--> statement-breakpoint
CREATE TABLE `department` (
	`department_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`status` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `department_department_id` PRIMARY KEY(`department_id`)
);
--> statement-breakpoint
CREATE TABLE `designation` (
	`designation_id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`status` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `designation_designation_id` PRIMARY KEY(`designation_id`)
);
--> statement-breakpoint
CREATE TABLE `employee` (
	`employee_id` int AUTO_INCREMENT NOT NULL,
	`uuid` varchar(255),
	`firstname` varchar(255),
	`middlename` varchar(255),
	`lastname` varchar(255),
	`status` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `employee_employee_id` PRIMARY KEY(`employee_id`)
);
--> statement-breakpoint
CREATE TABLE `employment_info` (
	`employment_information_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`hireDate` timestamp DEFAULT (now()),
	`department_id` int,
	`designation_id` int,
	`employee_type` enum('Regular','Probationary','Contractual','Seasonal','Temporary'),
	`employee_status` enum('Active','OnLeave','Terminated','Resigned','Suspended','Retired','Inactive'),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `employment_info_employment_information_id` PRIMARY KEY(`employment_information_id`)
);
--> statement-breakpoint
CREATE TABLE `financial_info` (
	`financial_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`pag_ibig_id` varchar(255),
	`sss_id` varchar(255),
	`philhealth_id` varchar(255),
	`tin` varchar(255),
	`bank_account_number` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `financial_info_financial_id` PRIMARY KEY(`financial_id`)
);
--> statement-breakpoint
CREATE TABLE `item` (
	`item_id` int AUTO_INCREMENT NOT NULL,
	`product_id` int,
	`stock` float,
	`re_order_level` float,
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `item_item_id` PRIMARY KEY(`item_id`)
);
--> statement-breakpoint
CREATE TABLE `leave_limit` (
	`leave_limit_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`limit_count` int,
	`leaveType` enum('Sick_Leave','Vacation_Leave','Personal_Leave'),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `leave_limit_leave_limit_id` PRIMARY KEY(`leave_limit_id`)
);
--> statement-breakpoint
CREATE TABLE `leave_request` (
	`leave_request_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`title` varchar(255),
	`content` varchar(255),
	`date_of_leave` date,
	`date_of_return` date,
	`status` varchar(255),
	`comment` varchar(255),
	`leaveType` enum('Sick_Leave','Vacation_Leave','Personal_Leave'),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `leave_request_leave_request_id` PRIMARY KEY(`leave_request_id`)
);
--> statement-breakpoint
CREATE TABLE `on_payroll` (
	`on_payroll_id` int AUTO_INCREMENT NOT NULL,
	`payroll_id` int,
	`employee_id` int,
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `on_payroll_on_payroll_id` PRIMARY KEY(`on_payroll_id`)
);
--> statement-breakpoint
CREATE TABLE `order` (
	`order_id` int AUTO_INCREMENT NOT NULL,
	`product_id` int,
	`items_ordered` int,
	`expected_arrival` date,
	`status` enum('Pending','Processing','Delivered','Cancelled','Return','Shipped'),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `order_order_id` PRIMARY KEY(`order_id`)
);
--> statement-breakpoint
CREATE TABLE `payroll` (
	`payroll_id` int AUTO_INCREMENT NOT NULL,
	`start` date,
	`end` date,
	`pay_date` date,
	`payroll_finished` date,
	`approvalStatus` enum('Active','Inactive','Inprogress'),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `payroll_payroll_id` PRIMARY KEY(`payroll_id`)
);
--> statement-breakpoint
CREATE TABLE `payroll_approval` (
	`payroll_approval_id` int AUTO_INCREMENT NOT NULL,
	`on_payroll_id` int,
	`signatory_id` int,
	`approvalstatus` enum('Approved','Pending','Rejected'),
	`approval_date` date,
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `payroll_approval_payroll_approval_id` PRIMARY KEY(`payroll_approval_id`)
);
--> statement-breakpoint
CREATE TABLE `payroll_reports` (
	`payroll_report` int AUTO_INCREMENT NOT NULL,
	`on_payroll_id` int,
	`netpay` float,
	`grosspay` float,
	`total_deductions` float,
	`total_benefits` float,
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `payroll_reports_payroll_report` PRIMARY KEY(`payroll_report`)
);
--> statement-breakpoint
CREATE TABLE `personal_info` (
	`personal_information_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`birthday` varchar(255),
	`gender` enum('Male','Female','Others'),
	`phone` varchar(255),
	`email` varchar(255),
	`address_line` varchar(255),
	`postal_code` varchar(255),
	`emergency_contact_name` varchar(255),
	`emergency_contact_phone` varchar(255),
	`emergency_contact_relationship` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `personal_info_personal_information_id` PRIMARY KEY(`personal_information_id`)
);
--> statement-breakpoint
CREATE TABLE `product` (
	`product_id` int AUTO_INCREMENT NOT NULL,
	`category_id` int,
	`supplier_id` int,
	`name` varchar(255),
	`description` varchar(255),
	`price` decimal(10,2),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `product_product_id` PRIMARY KEY(`product_id`)
);
--> statement-breakpoint
CREATE TABLE `salary_info` (
	`salary_information_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`payroll_frequency` enum('Daily','Weekly','BiWeekly','SemiMonthly','Monthly'),
	`base_salary` int,
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `salary_info_salary_information_id` PRIMARY KEY(`salary_information_id`)
);
--> statement-breakpoint
CREATE TABLE `signatory` (
	`signatory_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`signatory_name` varchar(255),
	`role` varchar(255),
	`permission_level` int,
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `signatory_signatory_id` PRIMARY KEY(`signatory_id`)
);
--> statement-breakpoint
CREATE TABLE `supplier` (
	`supplier_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`contact_number` varchar(255),
	`remarks` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `supplier_supplier_id` PRIMARY KEY(`supplier_id`)
);
--> statement-breakpoint
ALTER TABLE `activity_log` ADD CONSTRAINT `activity_log_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `additional_pay` ADD CONSTRAINT `additional_pay_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `adjustments` ADD CONSTRAINT `adjustments_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `arrived_Items` ADD CONSTRAINT `arrived_Items_order_id_order_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `benefits` ADD CONSTRAINT `benefits_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deductions` ADD CONSTRAINT `deductions_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employment_info` ADD CONSTRAINT `employment_info_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employment_info` ADD CONSTRAINT `employment_info_department_id_department_department_id_fk` FOREIGN KEY (`department_id`) REFERENCES `department`(`department_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employment_info` ADD CONSTRAINT `employment_info_designation_id_designation_designation_id_fk` FOREIGN KEY (`designation_id`) REFERENCES `designation`(`designation_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `financial_info` ADD CONSTRAINT `financial_info_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `item` ADD CONSTRAINT `item_product_id_product_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave_limit` ADD CONSTRAINT `leave_limit_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave_request` ADD CONSTRAINT `leave_request_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `on_payroll` ADD CONSTRAINT `on_payroll_payroll_id_payroll_payroll_id_fk` FOREIGN KEY (`payroll_id`) REFERENCES `payroll`(`payroll_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `on_payroll` ADD CONSTRAINT `on_payroll_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order` ADD CONSTRAINT `order_product_id_product_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_approval` ADD CONSTRAINT `payroll_approval_on_payroll_id_on_payroll_on_payroll_id_fk` FOREIGN KEY (`on_payroll_id`) REFERENCES `on_payroll`(`on_payroll_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_approval` ADD CONSTRAINT `payroll_approval_signatory_id_signatory_signatory_id_fk` FOREIGN KEY (`signatory_id`) REFERENCES `signatory`(`signatory_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_reports` ADD CONSTRAINT `payroll_reports_on_payroll_id_on_payroll_on_payroll_id_fk` FOREIGN KEY (`on_payroll_id`) REFERENCES `on_payroll`(`on_payroll_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `personal_info` ADD CONSTRAINT `personal_info_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_category_id_category_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_supplier_id_supplier_supplier_id_fk` FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`supplier_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salary_info` ADD CONSTRAINT `salary_info_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `signatory` ADD CONSTRAINT `signatory_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;