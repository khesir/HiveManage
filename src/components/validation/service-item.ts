import {z} from 'zod';

const productSchema = z.object({
	product_id: z.number().optional(),
	name: z
		.string()
		.regex(/^[a-zA-Z0-9 _-]+$/, {
			message:
				'Only letters, numbers, spaces, dashes, and underscores are allowed',
		})
		.min(1),

	img_url: z.string(),
	is_serialize: z.boolean().optional(),
	status: z.union([z.string().optional(), z.boolean()]),
	re_order_level: z.number().optional(),
	selling_price: z.number().min(1),

	total_quantity: z.number().optional(),
	sale_quantity: z.number().optional(),
	service_quantity: z.number().optional(),
	rent_quantity: z.number().optional(),
	damage_quantity: z.number().optional(),
	sold_quantity: z.number().optional(),

	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export const serviceItemSchema = z.object({
	service_id: z.number().min(1),
	product_id: z.number().min(1),
	serialize_items: z.array(z.number()).optional(),

	quantity: z.number().min(1),
	sold_price: z.number(),
	status: z.enum(['Pending', 'Used', 'Sold', 'Returned']),
	user_id: z.number().min(1),
	product: productSchema.optional(),

	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type ServiceItem = z.infer<typeof serviceItemSchema>;
