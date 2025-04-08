import {z} from 'zod';
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
	name: z
		.string()
		.regex(/^[a-zA-Z0-9 _-]+$/, {
			message:
				'Only letters, numbers, spaces, dashes, and underscores are allowed',
		})
		.min(1),

	img_url: z.string().optional(),
	is_serialize: z.boolean().optional(),
	status: z.union([z.string().optional(), z.boolean()]),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),

	product_details: productDetailsSchema.optional(),
});

const paymentSchema = z.object({
	payment_id: z.number().optional(),
	service_id: z.number().optional(),
	sales_id: z.number().optional(),
	amount: z.number().min(1),
	vat: z.number().optional(),
	discount_amount: z.number().optional(),
	payment_date: z.string().optional(),
	payment_method: z.enum(['Cash', 'Card', 'Online Payment']),
	payment_type: z.enum(['Service', 'Sales']),
	reference_number: z.string().optional(),
});

const customerSchema = z.object({
	customer_id: z.number().optional(),
	firstname: z.string().min(1),
	middlename: z.string().optional(),
	lastname: z.string().min(1),
	contact_phone: z.string().min(1),
	email: z.string().min(1),
	socials: z.array(
		z.object({
			type: z.string(),
			link: z.string(),
		}),
	),
	addressline: z.string().min(1),
	barangay: z.string().min(1),
	province: z.string().min(1),
	standing: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

const salesItemSchema = z.object({
	sales_items_id: z.number().optional(),

	product_id: z.number().min(1),
	sales_id: z.number().optional(),
	product_record_id: z.number().optional(),
	serial_id: z.number().optional(),

	quantity: z.number().min(1),
	total_price: z.number().min(1),

	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),

	product: productSchema.optional(),
});
const employeeSchema = z.object({
	employee_id: z.number().optional(),
	position_id: z.string().min(1),
	firstname: z.string().min(1, 'First name is required'),
	middlename: z.string().optional(),
	lastname: z.string().min(1, 'Last name is required'),
	email: z.string().min(1),
	profile_link: z.string().optional(),
	// This is just form form submission on settings, not part of employee Schema
	role_id: z.string().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export const salesSchema = z.object({
	sales_id: z.number().optional(),
	customer_id: z.number().optional(),
	handled_by: z.number().min(1),
	product_sold: z.number().optional(),
	total_price: z.number().optional(),
	status: z.enum(['Completed', 'Partially Completed', 'Cancelled', 'Pending']),

	salesItems: z.array(salesItemSchema).min(1),
	customer: customerSchema.optional(),
	payment: paymentSchema.optional(),
	employee: employeeSchema.optional(),

	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type Sales = z.infer<typeof salesSchema>;
