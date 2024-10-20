import {z} from 'zod';

export const itemsSchema = z.object({
	item_id: z.number().optional(),
	product_id: z.number().min(1),
	stock: z.number().min(1),
	on_listing: z.boolean(),
	tag: z.string().min(1),
	re_order_level: z.number().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type Items = z.infer<typeof itemsSchema>;
export type ItemWithDetails = {
	item_id: number;
	product: ProductWithType;
	stock: number;
	tag: string;
	on_listing: boolean;
	re_order_level: number;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
};

export const productSchema = z.object({
	product_id: z.number().optional(),
	category_id: z.number().min(1),
	supplier_id: z.number().min(1),
	name: z.string().min(1),
	description: z.string().min(1),
	price: z.number(),
	img_url: z.string().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductWithType = {
	product_id: number;
	category: Category;
	supplier: Supplier;
	name: string;
	description: string;
	price: number;
	img_url?: string;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
};

export const categorySchema = z.object({
	category_id: z.number().optional(),
	name: z.string().min(1),
	content: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type Category = z.infer<typeof categorySchema>;

export const supplierSchema = z.object({
	supplier_id: z.number().optional(),
	name: z.string().min(1),
	contact_number: z.number().min(1),
	remarks: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type Supplier = z.infer<typeof supplierSchema>;
