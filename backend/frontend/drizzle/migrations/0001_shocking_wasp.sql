ALTER TABLE `category` ADD `created_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `category` ADD `last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `category` ADD `deleted_at` timestamp;