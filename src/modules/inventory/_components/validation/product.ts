import {z} from 'zod';
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg'];

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

const supplierSchema = z.object({
	supplier_id: z.number().optional(),
	name: z.string().min(1),
	contact_number: z.string().min(1),
	remarks: z.string().min(1),
	profile_link: z.union([
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
	supplier: supplierSchema.optional(),
});
const batchItemSchema = z.object({
	batch_item_id: z.number().optional(),
	item_id: z.number().min(1),
	batch_number: z.string().min(1),
	item_condition: z.enum([
		'New',
		'Old',
		'Damage',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	]),
	item_status: z.enum(['Active', 'Reserve', 'Depleted']),
	quantity: z.number().min(1),
	reserved_quantity: z.number().optional(),
	pending_quantity: z.number().optional(),
	unit_price: z.number().min(1),
	selling_price: z.number().min(1),
	production_date: z.string().optional(),
	expiration_date: z.string().optional(),
});
const serializeItemSchema = z.object({
	serialized_item_id: z.number().optional(),
	item_id: z.number().min(1),
	serial_number: z.string().min(1),
	condition: z.enum([
		'New',
		'Old',
		'Damage',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	]),
	status: z.enum(['Active', 'Sold', 'Decommisioned']),
	unit_price: z.number().min(1),
	selling_price: z.number().min(1),
	warranty_expiry_date: z.string().optional(),
});
const productVariantSchema = z.object({
	variant_id: z.number().optional(),
	product_id: z.number().optional(),
	variant_name: z.string().min(1),
	img_url: z.string().min(1),
	attribute: z.record(z.union([z.string(), z.number(), z.boolean()])),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
});

const itemSchema = z.object({
	item_id: z.number().optional(),
	item_record_id: z.number().optional(),
	variant_id: z.number().min(1),
	item_type: z.enum(['Batch', 'Serialized', 'Both']),
	item_condition: z.enum([
		'New',
		'Old',
		'Damage',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	]),
	item_status: z.enum([
		'OnStock',
		'Sold',
		'Depleted',
		'Returned',
		'Pending Payment',
		'On Order',
		'In Transit',
		'Return Requested',
		'Pending Inspection',
		'In Service',
		'Under Repair',
		'Awaiting Service',
		'Ready for Pickup',
		'Retired',
	]),
	quantity: z.number().min(1),
	reorder_level: z.number().optional(),
	created_at: z.date().optional(),
	last_updated: z.date().optional(),
	deleted_at: z.date().nullable().optional(),

	variant: productVariantSchema.optional(),
	serial: serializeItemSchema.optional(),
	batch: batchItemSchema.optional(),
});
// =================================================================
// Actual Validation

export const productSchema = z.object({
	product_id: z.number().optional(),
	name: z.string().min(1),
	description: z.string().min(1),
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
	stock_limit: z.number().min(1),
	total_stock: z.number().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
	item_record: z.array(itemRecordSchema).optional(),
	product_categories: z.array(productCategorySchema).optional(),
	item: z.array(itemSchema).optional(),
});

export type Product = z.infer<typeof productSchema>;
