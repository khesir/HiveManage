import {z} from 'zod';
const serviceItemSchema = z.object({
	service_id: z.number().min(1),
	product_id: z.number().min(1),
	serialize_items: z.array(z.number()).optional(),
	quantity: z.number().min(1),
	sold_price: z.number(),
	status: z.enum(['Pending', 'Used', 'Sold', 'Returned']),
	user_id: z.number().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
const ownedItemsSchema = z.object({
	service_owned_id: z.number().optional(),
	service_id: z.number().min(1),
	name: z.string().optional(),
	item_description: z.string().optional().nullable(),
	serial_number: z.string(),
	brand: z.string(),
	model: z.string(),
	notes: z.string(),

	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export const replacementDetailsSchema = z.object({
	replacement_id: z.number().optional(),
	service_id: z.number().optional(),
	owned_items: z.array(z.number()).default([]),
	new_product: z.array(z.number()).default([]),
	reason: z.string().optional().nullable(),
	serviceItems: z.array(serviceItemSchema).optional(),
	ownedItems: z.array(ownedItemsSchema).optional(),
});
export type ReplacementDetails = z.infer<typeof replacementDetailsSchema>;

export const buildDetailsSchema = z.object({
	build_id: z.number().optional(),
	service_id: z.number().optional(),
	customer_items: z.array(z.number()).default([]),
	parts_used: z.array(z.number()).default([]),
	build_specs: z.string().optional(),
	checklist: z.string().optional(),

	serviceItems: z.array(serviceItemSchema).optional(),
	ownedItems: z.array(ownedItemsSchema).optional(),
});

export type BuildDetails = z.infer<typeof buildDetailsSchema>;

export const cleaningDetailSchema = z.object({
	cleaning_id: z.number().optional(),
	service_id: z.number().optional(),
	method: z.string().optional(),
	notes: z.string().optional(),
});

export type CleaningDetails = z.infer<typeof cleaningDetailSchema>;

export const repairDetailsSchema = z.object({
	repair_details_id: z.number().optional(),
	service_id: z.number().optional(),
	parts_used: z.array(z.number()).default([]),
	diagnostic_notes: z.string().optional().nullable(),
	work_done: z.string().optional().nullable(),

	serviceItems: z.array(serviceItemSchema).optional(),
	ownedItems: z.array(ownedItemsSchema).optional(),
});
export type RepairDetails = z.infer<typeof repairDetailsSchema>;

export const upgradeDetailsSchema = z.object({
	upgrade_id: z.number().optional(),
	service_id: z.number().optional(),
	before_specs: z.array(z.number()).default([]),
	upgraded_components: z.array(z.number()).default([]),
	notes: z.string().optional().nullable(),

	serviceItems: z.array(serviceItemSchema).optional(),
	ownedItems: z.array(ownedItemsSchema).optional(),
});
export type UpgradeDetails = z.infer<typeof upgradeDetailsSchema>;

export const rentDetailsSchema = z.object({
	rent_id: z.number().optional(),
	service_id: z.number().optional(),
	rented_items: z.array(z.number()).default([]),
	start_date: z.string().min(1),
	end_date: z.string().min(1),
	deposit: z.number().min(0),
	returned: z.boolean().default(false),

	serviceItems: z.array(serviceItemSchema).optional(),
});

export type RentDetails = z.infer<typeof rentDetailsSchema>;
