import {z} from 'zod';

const productVariantSchema = z.object({
	variant_id: z.number().optional(),
	product_id: z.number().optional(),
	variant_name: z.string().min(1),
	img_url: z.string().min(1),
	attribute: z.record(z.union([z.string(), z.number(), z.boolean()])),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
});

export const itemSchema = z.object({
	item_id: z.number().optional(),
	item_record_id: z.number().optional(),
	variant_id: z.number().min(1),
	item_type: z.enum(['Batch', 'Serialized', 'Both']),
	item_condition: z.enum([
		'New',
		'Old',
		'Damage',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	]),
	item_status: z.enum([
		'OnStock',
		'Sold',
		'Depleted',
		'Returned',
		'Pending Payment',
		'On Order',
		'In Transit',
		'Return Requested',
		'Pending Inspection',
		'In Service',
		'Under Repair',
		'Awaiting Service',
		'Ready for Pickup',
		'Retired',
	]),
	quantity: z.number().min(1),
	reorder_level: z.number().optional(),
	created_at: z.date().optional(),
	last_updated: z.date().optional(),
	deleted_at: z.date().nullable().optional(),

	variant: productVariantSchema.optional(),
});
export type Item = z.infer<typeof itemSchema>;
