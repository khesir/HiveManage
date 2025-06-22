import {z} from 'zod';

const productDetailsSchema = z.object({
	p_details_id: z.number().optional(),
	description: z.string().optional(),
	color: z
		.string()
		.regex(/^[a-zA-Z0-9 ]+$/, {
			message: 'Only letters, numbers, and spaces are allowed',
		})
		.optional(),
	size: z
		.string()
		.regex(/^[a-zA-Z0-9 ]+$/, {
			message: 'Only letters, numbers, and spaces are allowed',
		})
		.optional(),
	created_at: z.date().optional(),
	last_updated: z.date().optional(),
	deleted_at: z.date().nullable().optional(),
});

const productSchema = z.object({
	product_id: z.number().optional(),
	name: z
		.string()
		.regex(/^[a-zA-Z0-9 _-]+$/, {
			message:
				'Only letters, numbers, spaces, dashes, and underscores are allowed',
		})
		.min(1),

	img_url: z.string().optional(),
	is_serialize: z.boolean().optional(),
	status: z.union([z.string().optional(), z.boolean()]),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),

	product_details: productDetailsSchema.optional(),
});

export const salesItemSchema = z.object({
	sales_items_id: z.number().optional(),
	product_id: z.number().min(1),
	sales_id: z.number().min(1),
	quantity: z.number().min(1),
	sold_price: z.number().min(1),

	return_qty: z.number().optional(),
	refund_amount: z.number().optional(),
	return_note: z.string().optional().nullable(),
	warranty_date: z.string().optional(),
	warranty_used: z.boolean().default(false),
	product: productSchema.optional(),
	user_id: z.number(),
});

export type SalesItem = z.infer<typeof salesItemSchema>;
