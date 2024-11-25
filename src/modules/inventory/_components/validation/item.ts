import {z} from 'zod';

export const itemSchema = z.object({
	item_record_id: z.number().optional(),
	serial_number: z.string().optional(),
	batch_number: z.string().optional(),
	item_number: z.string().min(1), // This holds as the dynamic holder of serial and batch number
	item_type: z.enum(['Batch', 'Serialized']),
	item_condition: z.enum([
		'New',
		'Old',
		'Damage',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	]),
	item_status: z.enum(['On Stock', 'Sold', 'Depleted']),
	quantity: z.number().min(1),
	unit_price: z.number().min(1),
	selling_price: z.number().min(1),
	warranty_expiry_date: z.string(),
	created_at: z.date().optional(),
	last_updated: z.date().optional(),
	deleted_at: z.date().nullable().optional(),
});
export type Item = z.infer<typeof itemSchema>;
