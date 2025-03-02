import {z} from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg'];
// Support Schema
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

const batchItem = z.object({
	batch_item_id: z.number().optional(),
	item_id: z.number().optional(),
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
	unit_price: z.number().min(1),
	selling_price: z.number().min(1),
	production_date: z.string().optional(),
	expiration_date: z.string().optional(),
});

const serializeItem = z.object({
	serialized_item_id: z.number().optional(),
	item_id: z.number().optional(),
	serial_number: z.string().min(1),
	item_condition: z.enum([
		'New',
		'Old',
		'Damage',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	]),
	item_status: z.enum(['Active', 'Sold', 'Decommisioned']),
	unit_price: z.number().min(1),
	selling_price: z.number().min(1),
	warranty_expiry_date: z.string().optional(),
});

const itemSchema = z.object({
	item_record_id: z.number().optional(),
	variant_id: z.number().min(1),
	item_type: z.enum(['Batch', 'Serialized', 'Both']),
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
	ordered_qty: z.number().optional(),
	quantity: z.number().min(1),
	reorder_level: z.number().optional(),
	batch_items: z.array(batchItem).optional(),
	serialize_items: z.array(serializeItem).optional(),
});

// =================================================================
// Actual Zod
export const itemRecordSchema = z.object({
	item_record_id: z.number().optional(), // Autoincrement main ID
	product_id: z.number().optional(), // This is handled in the backend
	supplier_id: z.number().min(1),
	ordered_qty: z.number().optional(),
	total_stock: z.number().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
	// Relation
	item: itemSchema.optional(),
	supplier: supplierSchema.optional(),
});
export type ItemRecords = z.infer<typeof itemRecordSchema>;
