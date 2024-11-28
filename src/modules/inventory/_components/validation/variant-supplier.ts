import {z} from 'zod';

const productVariantSchema = z.object({
	variant_id: z.number().optional(),
	product_id: z.number().optional(),
	variant_name: z.string().min(1),
	img_url: z.string().min(1),
	attribute: z.record(z.union([z.string(), z.number(), z.boolean()])),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
});
const supplierSchema = z.object({
	supplier_id: z.number().optional(),
	name: z.string().min(1),
	contact_number: z.string().min(1),
	remarks: z.string().min(1),
	profile_link: z.string(),
	relationship: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export const productVariantSupplierSchema = z.object({
	variant_supplier_id: z.number().optional(),
	variant_id: z.number().min(1),
	supplier_id: z.number().min(1),
	minimum_order_quantity: z.number().optional(),
	lead_time_days: z.number().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	// Join Tables
	variant: productVariantSchema.optional(),
	supplier: supplierSchema.optional(),
});

export type ProductVariantSupplier = z.infer<
	typeof productVariantSupplierSchema
>;
