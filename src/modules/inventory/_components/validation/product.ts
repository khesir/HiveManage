import {z} from 'zod';
import {Supplier} from './supplier';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg'];

export const inventorySchema = z.object({
	item_record_id: z.number().optional(),
	supplier_id: z.number().optional(),
	product_id: z.number().optional(),
	tag: z.string().min(1),
	stock: z.string().min(1),
	unit_price: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type ItemRecords = z.infer<typeof inventorySchema>;
export type ItemRecordsWithDetails = {
	item_record_id: number;
	supplier_id: number;
	product_id: number;
	tag: string;
	stock: number;
	unit_price: number;
	reserve_stock: number;
	created_at: string;
	last_updated: string;
	deleted_at: string;
	supplier?: Supplier;
	product?: Product;
};

export const priceCostSchema = z.object({
	price_history_id: z.number().optional(),
	product_id: z.string().optional(),
	price: z.string(),
	change_date: z.string().optional(),
	last_updated: z.string().optional(),
	created_at: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type PriceCost = z.infer<typeof priceCostSchema>;
export type PriceCostWithDetails = {
	price_history_id: number;
	product_id: number;
	price: number;
	change_date: string;
	created_at: string;
	last_updated: string;
	deleted_at: string;
	product?: Product;
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

export const productSchema = z.object({
	product_id: z.number().optional(),
	name: z.string().min(1),
	description: z.string().min(1),
	on_listing: z.boolean(),
	img_url: z
		.instanceof(File)
		.optional()
		.refine((file) => {
			return !file || file.size <= MAX_UPLOAD_SIZE;
		}, 'File size must be less than 3MB')
		.refine((file) => {
			return !file || ACCEPTED_FILE_TYPES.includes(file.type);
		}, 'File must be a PNG or JPEG'),
	inventory_limit: z.string().min(1),
	re_order_level: z.string().min(1),
	total_stocks: z.string().optional(),
	total_reserve_stocks: z.string().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
	price_history: priceCostSchema,
	item_record: z.array(inventorySchema).optional(),
	product_category: z.array(productCategorySchema).optional(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductWithRelatedTables = {
	product_id: number;
	name: string;
	description: string;
	on_listing: boolean;
	re_order_level: number;
	total_stocks: number;
	total_reserve_stocks: number;
	img_url: string;
	inventory_limit: number;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
	price_history?: PriceCost[];
	product_categories?: ProductCategoryWithDetails[];
	item_record?: ItemRecordsWithDetails[];
};
