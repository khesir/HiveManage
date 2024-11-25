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
const itemSchema = z.object({
	item_record_id: z.number().optional(),
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
// =================================================================
// Actual Zod
export const itemRecordSchema = z.object({
	item_record_id: z.number().optional(), // Autoincrement main ID
	product_id: z.number().optional(), // This is handled in the backend
	supplier_id: z.number().min(1),
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
export type ItemRecords = z.infer<typeof itemRecordSchema>;
