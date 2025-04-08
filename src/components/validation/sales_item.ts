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
	product_id: z.number().optional(),
	sales_id: z.number().optional(),
	product_record_id: z.number().optional(),
	serial_id: z.number().optional(),

	quantity: z.number().min(1),
	total_price: z.number().min(1),

	product: productSchema.optional(),
});

export type SalesItem = z.infer<typeof salesItemSchema>;
