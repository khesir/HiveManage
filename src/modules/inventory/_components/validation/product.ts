import {z} from 'zod';
import {Supplier} from './supplier';
import {ProductCategoryWithDetails} from './category';

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
export type ProductWithRelatedTables = {
	product_id: number;
	name: string;
	description: string;
	on_listing: boolean;
	re_order_level: number;
	total_stocks: number;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
	price_history?: PriceCost[];
	product_categories?: ProductCategoryWithDetails[];
	inventory_record?: InventoryRecordsWithDetails[];
};

export const inventorySchema = z.object({
	inventory_record_id: z.number(),
	supplier_id: z.number(),
	product_id: z.number(),
	tag: z.string(),
	stock: z.number(),
	created_at: z.string(),
	last_updated: z.string(),
	deleted_at: z.string(),
});
export type InventoryRecords = z.infer<typeof inventorySchema>;
export type InventoryRecordsWithDetails = {
	inventory_record_id: number;
	supplier_id: number;
	product_id: number;
	tag: string;
	stock: number;
	created_at: string;
	last_updated: string;
	deleted_at: string;
	supplier?: Supplier;
	product?: Product;
};

export const priceCostSchema = z.object({
	price_history_id: z.number().optional(),
	product_id: z.number(),
	price: z.number(),
	change_date: z.string().min(1),
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
