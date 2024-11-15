import {z} from 'zod';

export const categorySchema = z.object({
	category_id: z.number().optional(),
	name: z.string().min(1),
	content: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type Category = z.infer<typeof categorySchema>;

export const productCategorySchema = z.object({
	product_category_id: z.number().min(1),
	product_id: z.number().min(1),
	category_id: z.number().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type ProductCategory = z.infer<typeof productCategorySchema>;

export type ProductCategoryWithDetails = {
	product_category_id: number;
	product_id: number;
	category_id: number;
	created_at: string;
	last_updated: string;
	deleted_at: string;
	category: Category;
};
