import {z} from 'zod';
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg'];

export const orderSchema = z.object({
	order_id: z.number().optional(),
	supplier_id: z.string().nullable().optional(),
	ordered_value: z.string().optional(),
	expected_arrival: z.string().refine(
		(date) => {
			if (!date) return false;
			const expectedDate = new Date(date);
			const currentDate = new Date();
			return expectedDate > currentDate;
		},
		{
			message: 'Date should be after today.',
		},
	),
	status: z.enum([
		'Pending',
		'Processing',
		'Delivered',
		'Cancelled',
		'Return',
		'Shipped',
		'Verification',
		'Moved to Inventory',
	]),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().nullable().optional(),
});

const categorySchema = z.object({
	category_id: z.number().optional(),
	name: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
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
});
const serials = z.object({
	serial_id: z.number(),
	product_id: z.number(),
	serial_number: z.number(),
	external_serial_code: z.string().optional(),
	price: z.number().optional(),
	condition: z.string(),
	status: z.string(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
const productSupplier = z.object({
	product_supplier_id: z.number(),
	supplier_id: z.number().optional(),
	product_id: z.number().optional(),
	supplier: supplierSchema.optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

const productCategory = z.object({
	product_category_id: z.number(),
	category_id: z.number().optional(),
	product_id: z.number().optional(),
	category: categorySchema.optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

const productRecords = z.object({
	product_record_id: z.number().optional(),
	product_id: z.number().optional(),
	quantity: z.number().default(0),
	price: z.number().default(0),
	condition: z.string(),
	status: z.string(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

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

export const productOrders = z.object({
	order_product_id: z.number().optional(),

	order_id: z.number().optional(),
	product_id: z.number().min(1),
	quantity: z.string().min(1),
	price: z.string().min(1),
	status: z.string(),
	created_at: z.date().optional(),
	last_updated: z.date().optional(),
	deleted_at: z.date().nullable().optional(),
});
// =================================================================
// Actual Validation

export const productSchema = z.object({
	product_id: z.number().optional(),
	name: z
		.string()
		.regex(/^[a-zA-Z0-9 _-]+$/, {
			message:
				'Only letters, numbers, spaces, dashes, and underscores are allowed',
		})
		.min(1),

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
	is_serialize: z.boolean().optional(),
	status: z.union([z.string().optional(), z.boolean()]),
	re_order_level: z.number().optional(),
	selling_price: z.number().min(1),

	total_quantity: z.number().optional(),
	available_quantity: z.number().optional(),
	transfered_quantity: z.number().optional(),
	sold_quantity: z.number().optional(),

	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),

	product_details: productDetailsSchema.optional(),
	product_records: z.array(productRecords).optional(),
	product_categories: z.array(productCategory).optional(),
	product_serials: z.array(serials).optional(),
	product_suppliers: z.array(productSupplier).optional(),
	product_orders: z.array(productOrders).optional(),
});

export type Product = z.infer<typeof productSchema>;
