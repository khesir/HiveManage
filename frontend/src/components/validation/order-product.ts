import {z} from 'zod';
const orderStatusEnum = z.enum([
	'Draft',
	'Finalized',
	'Awaiting Arrival',
	'Partially Delivered',
	'Delivered',
	'Cancelled',
	'Returned',
	'Stocked',
]);
const orderPaymentStatus = z.enum(['Pending', 'Partially Paid', 'Paid']);
const orderPaymentMethod = z.enum([
	'Cash',
	'Credit Card',
	'Bank Transfer',
	'Check',
	'Digital Wallet',
]);
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

const productSchema = z.object({
	product_id: z.number().optional(),
	name: z.string().min(1),
	description: z.string().min(1),
	img_url: z.string(),
	is_serialize: z.boolean().optional(),
	stock_limit: z.number().min(1),
	total_stock: z.number().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),

	product_categories: z.array(productCategorySchema).optional(),
	product_details: productDetailsSchema.optional(),
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
const orderSchema = z.object({
	order_id: z.number().optional(),
	supplier_id: z.string().nullable().optional(),

	notes: z.string().optional(),
	expected_arrival: z
		.string()
		.refine(
			(date) => {
				if (!date) return false;
				const expectedDate = new Date(date);
				const currentDate = new Date();
				return expectedDate > currentDate;
			},
			{
				message: 'Date should be after today.',
			},
		)
		.optional(),
	order_value: z.number(),
	order_status: orderStatusEnum,
	order_payment_status: orderPaymentStatus.optional(),
	order_payment_method: orderPaymentMethod.optional(),
	supplier: supplierSchema.optional(),
});
const employeeSchema = z.object({
	employee_id: z.number().optional(),
	position_id: z.string().min(1),
	firstname: z.string().min(1, 'First name is required'),
	middlename: z.string().optional(),
	lastname: z.string().min(1, 'Last name is required'),
	email: z.string().min(1),
	profile_link: z.string(),
	role_id: z.string().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export const orderLogsSchema = z.object({
	order_log_id: z.number(),
	order_id: z.number(),
	product_id: z.number(),
	order_item_id: z.number(),

	total_quantity: z.string(),
	ordered_quantity: z.string(),
	delivered_quantity: z.string(),
	resolved_quantity: z.string(),

	status: z.string(),
	action_type: z.string(),

	performed_by: employeeSchema,
	resolve_type: z.string(),
	notes: z.string(),
	created_at: z.string(),
	last_updated: z.string(),
	deleted_at: z.string(),
});
export const orderProductSchema = z.object({
	order_product_id: z.number().optional(),
	order_id: z.number().optional(),
	product_id: z.number().min(1),

	total_quantity: z.number().min(1),
	ordered_quantity: z.number().optional().default(0),
	delivered_quantity: z.number().optional().default(0),
	resolved_quantity: z.number().optional().default(0),

	unit_price: z.string().min(1),

	is_serialize: z.boolean().optional(),
	status: z.string().min(1),
	order_log: z.array(orderLogsSchema).optional(),
	order: orderSchema.optional(),
	product: productSchema.optional(),
});
export type OrderProduct = z.infer<typeof orderProductSchema>;
