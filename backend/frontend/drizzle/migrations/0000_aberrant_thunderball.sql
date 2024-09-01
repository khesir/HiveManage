CREATE TABLE `activity_log` (
	`activity_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`action` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `activity_log_activity_id` PRIMARY KEY(`activity_id`)
);
--> statement-breakpoint
CREATE TABLE `department` (
	`department_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`status` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `department_department_id` PRIMARY KEY(`department_id`)
);
--> statement-breakpoint
CREATE TABLE `designation` (
	`designation_id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`status` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
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
	CONSTRAINT `employee_employee_id` PRIMARY KEY(`employee_id`)
);
--> statement-breakpoint
CREATE TABLE `employment_information` (
	`employment_information_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`hireDate` timestamp DEFAULT (now()),
	`department_id` int,
	`designation_id` int,
	`employee_type` enum('regular','probationary','contractual','seasonal','temporary'),
	`employee_status` enum('active','onLeave','terminated','resigned','suspended','retired','inactive'),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employment_information_employment_information_id` PRIMARY KEY(`employment_information_id`)
);
--> statement-breakpoint
CREATE TABLE `financial_information` (
	`financial_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`pag_ibig_id` varchar(255),
	`sss_id` varchar(255),
	`philhealth_id` varchar(255),
	`tin` varchar(255),
	`bank_account_number` varchar(255),
	CONSTRAINT `financial_information_financial_id` PRIMARY KEY(`financial_id`)
);
--> statement-breakpoint
CREATE TABLE `leave_limit` (
	`leave_limit_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`limit_count` int,
	`leaveType` enum('sick_leave','vacation_leave','personal_leave'),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leave_limit_leave_limit_id` PRIMARY KEY(`leave_limit_id`)
);
--> statement-breakpoint
CREATE TABLE `personal_information` (
	`personal_information_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`birthday` varchar(255),
	`gender` enum('male','female','others'),
	`phone` varchar(255),
	`email` varchar(255),
	`address_line` varchar(255),
	`postal_code` varchar(255),
	`emergency_contact_name` varchar(255),
	`emergency_contact_phone` varchar(255),
	`emergency_contact_relationship` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `personal_information_personal_information_id` PRIMARY KEY(`personal_information_id`)
);
--> statement-breakpoint
CREATE TABLE `salary_information` (
	`salary_information_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int,
	`payroll_frequency` enum('daily','weekly','biWeekly','semiMonthly','monthly'),
	`base_salary` int,
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `salary_information_salary_information_id` PRIMARY KEY(`salary_information_id`)
);
--> statement-breakpoint
ALTER TABLE `activity_log` ADD CONSTRAINT `activity_log_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employment_information` ADD CONSTRAINT `employment_information_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `financial_information` ADD CONSTRAINT `financial_information_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave_limit` ADD CONSTRAINT `leave_limit_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `personal_information` ADD CONSTRAINT `personal_information_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salary_information` ADD CONSTRAINT `salary_information_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;