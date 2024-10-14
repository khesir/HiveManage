ALTER TABLE "additional_pay" ALTER COLUMN "additional_pay_type" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "additional_pay" ADD COLUMN "name" varchar(255);--> statement-breakpoint
ALTER TABLE "adjustments" ADD COLUMN "name" varchar(255);--> statement-breakpoint
ALTER TABLE "benefits" ADD COLUMN "name" varchar(255);--> statement-breakpoint
ALTER TABLE "deductions" ADD COLUMN "name" varchar(255);