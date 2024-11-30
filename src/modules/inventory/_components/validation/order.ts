import {z} from 'zod';

const orderItemSchema = z.object({
	order_item_id: z.number().optional(),
	order_id: z.number().optional(),
	item_id: z.number().optional(),
	variant_id: z.number().min(1),
	product_id: z.number().min(1),
	quantity: z.string().min(1),
	price: z.string().min(1),
	status: z.enum([
		'Pending',
		'Partially Delivered',
		'Delivered',
		'Damaged',
		'Returned',
		'Cancelled',
	]),
	item_type: z.enum(['Batch', 'Serialized', 'Both']),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().nullable().optional(),
});

// Actual Schema
export const orderSchema = z.object({
	order_id: z.number().optional(),
	supplier_id: z.string().nullable().optional(),
	ordered_value: z.string().optional(),
	expected_arrival: z.string().refine(
		(date) => {
			if (!date) return false;
			const expectedDate = new Date(date);
			const currentDate = new Date();
			return expectedDate > currentDate;
		},
		{
			message: 'Date should be after today.',
		},
	),
	status: z.enum([
		'Pending',
		'Processing',
		'Delivered',
		'Cancelled',
		'Return',
		'Shipped',
		'Verification',
		'Moved to Inventory',
	]),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().nullable().optional(),
	order_items: z.array(orderItemSchema).optional(),
});

export type Order = z.infer<typeof orderSchema>;
