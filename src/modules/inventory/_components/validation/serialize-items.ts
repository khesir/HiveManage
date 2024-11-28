import {z} from 'zod';

export const serializeItemSchema = z.object({
	serialized_item_id: z.number().optional(),
	item_id: z.number().min(1),
	serial_number: z.string().min(1),
	condition: z.enum([
		'New',
		'Old',
		'Damage',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	]),
	status: z.enum(['Active', 'Sold', 'Decommisioned']),
	unit_price: z.number().min(1),
	selling_price: z.number().min(1),
	warranty_expiry_date: z.string().optional(),
});
export type SerializeItem = z.infer<typeof serializeItemSchema>;
