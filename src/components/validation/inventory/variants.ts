import {z} from 'zod';

const categorySchema = z.object({
	category_id: z.number().optional(),
	name: z.string().min(1),
	content: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

const productCategorySchema = z.object({
	product_category_id: z.number().min(1),
	product_id: z.number().min(1),
	category_id: z.number().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
	category: categorySchema.optional(),
});

const itemSchema = z.object({
	item_record_id: z.number().min(1),
	serial_number: z.string().optional(),
	batch_number: z.string().optional(),
	item_number: z.string().min(1), // This holds as the dynamic holder of serial and batch number
	item_type: z.enum(['Batch', 'Serialized']),
	item_condition: z.enum([
		'New',
		'Old',
		'Damage',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	]),
	item_status: z.enum(['On Stock', 'Sold', 'Depleted']),
	quantity: z.number().min(1),
	unit_price: z.number().min(1),
	selling_price: z.number().min(1),
	warranty_expiry_date: z.string(),
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
	categories: z.array(productCategorySchema).optional(),
});
const itemRecordSchema = z.object({
	item_record_id: z.number().optional(),
	supplier_id: z.number().optional(),
	product_id: z.number().optional(),
	ordered_qty: z.number().optional(),
	total_stock: z.number().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
	// Relation
	item: z.array(itemSchema).optional(),
	supplier: supplierSchema.optional(),
	product: z
		.object({
			product_id: z.number().optional(),
			name: z.string().min(1),
			description: z.string().min(1),
			img_url: z.string(),
			stock_limit: z.string().min(1),
			total_stock: z.string().optional(),
			created_at: z.string().optional(),
			last_updated: z.string().optional(),
			deleted_at: z.string().optional(),
		})
		.optional(),
});

const productSchema = z.object({
	product_id: z.number().optional(),
	name: z.string().min(1),
	description: z.string().min(1),
	img_url: z.string(),
	stock_limit: z.number().min(1),
	total_stock: z.number().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
	item_record: z.array(itemRecordSchema).optional(),
	product_categories: z.array(productCategorySchema).optional(),
});
const productVariantSupplierSchema = z.object({
	variant_supplier_id: z.number().optional(),
	variant_id: z.number().min(1),
	supplier_id: z.number().min(1),
	minimum_order_quantity: z.number().optional(),
	lead_time_days: z.number().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	// Join Tables
	supplier: supplierSchema.optional(),
});

// =================================================================
// Actual Validation
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg'];

export const productVariantSchema = z.object({
	variant_id: z.number().optional(),
	product_id: z.number().optional(),
	variant_name: z.string().min(1),
	img_url: z.union([
		z
			.instanceof(File)
			.optional()
			.refine((file) => {
				return !file || file.size <= MAX_UPLOAD_SIZE;
			}, 'File size must be less than 3MB')
			.refine((file) => {
				return !file || ACCEPTED_FILE_TYPES.includes(file.type);
			}, 'File must be a PNG or JPEG'),
		z.string(),
	]),
	attributes: z.array(
		z.object({
			key: z.string(),
			value: z.union([z.string(), z.number(), z.boolean()]),
		}),
	),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),

	product: productSchema.optional(),
	prdvariantsupp: z.array(productVariantSupplierSchema).optional(),
});
export type ProductVariant = z.infer<typeof productVariantSchema>;
