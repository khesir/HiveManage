ALTER TABLE `activity_log` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `additional_pay` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `adjustments` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `attendance` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `benefits` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `deductions` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `department` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `designation` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `employee` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `employment_information` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `financial_information` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `leave_limit` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `leave_request` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `on_payroll` ADD `created_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `on_payroll` ADD `last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `on_payroll` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `payroll` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `payroll_approval` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `payroll_reports` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `personal_information` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `salary_information` ADD `deleted_at` timestamp;