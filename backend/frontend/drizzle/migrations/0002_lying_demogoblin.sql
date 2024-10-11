ALTER TABLE "payroll_approval" DROP CONSTRAINT "payroll_approval_signatory_id_signatory_signatory_id_fk";
--> statement-breakpoint
ALTER TABLE "payroll" ADD COLUMN "signatory_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payroll" ADD CONSTRAINT "payroll_signatory_id_signatory_signatory_id_fk" FOREIGN KEY ("signatory_id") REFERENCES "public"."signatory"("signatory_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "payroll_approval" DROP COLUMN IF EXISTS "signatory_id";