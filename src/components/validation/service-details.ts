import {z} from 'zod';

export const replacementDetailsSchema = z.object({
	replacement_id: z.number().optional(),
	service_id: z.number().optional(),
	owned_items: z.array(z.number()).default([]),
	new_product: z.array(z.number()).default([]),
	reason: z.string().optional().nullable(),
});
export type ReplacementDetails = z.infer<typeof replacementDetailsSchema>;

export const buildDetailsSchema = z.object({
	build_id: z.number().optional(),
	service_id: z.number().optional(),
	customer_items: z.array(z.number()).default([]),
	parts_used: z.array(z.number()).default([]),
	build_specs: z.string(),
	checklist: z.string(),
});

export type BuildDetails = z.infer<typeof buildDetailsSchema>;

export const cleaningDetailSchema = z.object({
	cleaning_id: z.number().optional(),
	service_id: z.number().optional(),
	method: z.string(),
	notes: z.string(),
});

export type CleaningDetails = z.infer<typeof cleaningDetailSchema>;

export const rentDetailsSchema = z.object({
	rent_id: z.number().optional(),
	service_id: z.number().optional(),
	rented_items: z.array(z.number()).default([]),
	start_date: z.string().min(1),
	end_date: z.string().min(1),
	deposit: z.string().min(0),
	returned: z.boolean().default(false),
});

export type RentDetails = z.infer<typeof rentDetailsSchema>;

export const repairDetailsSchema = z.object({
	repair_details_id: z.number().optional(),
	service_id: z.number().optional(),
	parts_used: z.array(z.number()).default([]),
	diagnostic_notes: z.string().optional().nullable(),
	work_done: z.string().optional().nullable(),
});
export type RepairDetails = z.infer<typeof repairDetailsSchema>;

export const upgradeDetails = z.object({
	upgrade_id: z.number().optional(),
	service_id: z.number().optional(),
	before_specs: z.array(z.number()).default([]),
	upgraded_components: z.array(z.number()).default([]),
	notes: z.string().optional().nullable(),
});
export type UpgradeDetails = z.infer<typeof upgradeDetails>;
