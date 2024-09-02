CREATE TABLE `additional_pay` (
	`additional_pay_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`additional_pay_type` varchar(255),
	`amount` float,
	`description` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
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
	CONSTRAINT `adjustments_adjustments_id` PRIMARY KEY(`adjustments_id`)
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`attendance_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`date` date,
	`clock_in` date,
	`clock_out` date,
	`hoursWorked` decimal(10,2),
	`attendance_status` enum('present','absent','late','early_leave','paid_leave'),
	`description` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
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
	CONSTRAINT `benefits_benefits_id` PRIMARY KEY(`benefits_id`)
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
	CONSTRAINT `deductions_deduction_id` PRIMARY KEY(`deduction_id`)
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
	`leaveType` enum('sick_leave','vacation_leave','personal_leave'),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leave_request_leave_request_id` PRIMARY KEY(`leave_request_id`)
);
--> statement-breakpoint
CREATE TABLE `on_payroll` (
	`on_payroll_id` int AUTO_INCREMENT NOT NULL,
	`payroll_id` int,
	`employee_id` int,
	CONSTRAINT `on_payroll_on_payroll_id` PRIMARY KEY(`on_payroll_id`)
);
--> statement-breakpoint
CREATE TABLE `payroll` (
	`payroll_id` int AUTO_INCREMENT NOT NULL,
	`start` date,
	`end` date,
	`pay_date` date,
	`payroll_finished` date,
	`approvalStatus` enum('active','inactive','inprogress'),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payroll_payroll_id` PRIMARY KEY(`payroll_id`)
);
--> statement-breakpoint
CREATE TABLE `payroll_approval` (
	`payroll_approval_id` int AUTO_INCREMENT NOT NULL,
	`on_payroll_id` int,
	`signatory_id` int,
	`approvalstatus` enum('approved','pending','rejected'),
	`approval_date` date,
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
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
	CONSTRAINT `payroll_reports_payroll_report` PRIMARY KEY(`payroll_report`)
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
	`deleted_at` timestamp DEFAULT (now()),
	CONSTRAINT `signatory_signatory_id` PRIMARY KEY(`signatory_id`)
);
--> statement-breakpoint
ALTER TABLE `additional_pay` ADD CONSTRAINT `additional_pay_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `adjustments` ADD CONSTRAINT `adjustments_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `benefits` ADD CONSTRAINT `benefits_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deductions` ADD CONSTRAINT `deductions_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave_request` ADD CONSTRAINT `leave_request_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `on_payroll` ADD CONSTRAINT `on_payroll_payroll_id_payroll_payroll_id_fk` FOREIGN KEY (`payroll_id`) REFERENCES `payroll`(`payroll_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `on_payroll` ADD CONSTRAINT `on_payroll_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_approval` ADD CONSTRAINT `payroll_approval_on_payroll_id_on_payroll_on_payroll_id_fk` FOREIGN KEY (`on_payroll_id`) REFERENCES `on_payroll`(`on_payroll_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_approval` ADD CONSTRAINT `payroll_approval_signatory_id_signatory_signatory_id_fk` FOREIGN KEY (`signatory_id`) REFERENCES `signatory`(`signatory_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_reports` ADD CONSTRAINT `payroll_reports_on_payroll_id_on_payroll_on_payroll_id_fk` FOREIGN KEY (`on_payroll_id`) REFERENCES `on_payroll`(`on_payroll_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `signatory` ADD CONSTRAINT `signatory_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;