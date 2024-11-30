import {z} from 'zod';

export const orderItemSchema = z.object({
	order_item_id: z.number().optional(),

	order_id: z.number().optional(),
	item_id: z.number().min(1),
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
	created_at: z.date().optional(),
	last_updated: z.date().optional(),
	deleted_at: z.date().nullable().optional(),
});
export type OrderItem = z.infer<typeof orderItemSchema>;
