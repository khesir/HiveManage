import {z} from 'zod';
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
const serviceSchema = z.object({
	service_id: z.number().optional(),
	service_type_id: z.number().min(1),
	uuid: z.string().min(1),
	fee: z.number().min(0),
	description: z.string().min(1),
	customer_id: z.number().optional(),
	service_status: z.enum(['Pending', 'In Progress', 'Complete']),
	total_cost_price: z.number().optional(),
	is_returned: z.boolean().default(false),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
const paymentSchema = z.object({
	payment_id: z.number().optional(),
	service_id: z.number().optional(),
	sales_id: z.number().optional(),
	amount: z.number().min(1, {message: 'Amount must be at least 1'}),
	vat_amount: z.number().optional(),
	discount_amount: z.number().optional(),
	paid_amount: z.number().min(1, {message: 'Paid amount must be at least 1'}),
	change_amount: z.number().optional(),
	payment_date: z.string().optional(),
	payment_method: z.enum(['Cash', 'Card', 'Online Payment'], {
		message: 'Invalid payment method',
	}),
	payment_type: z.enum(['Service', 'Sales'], {message: 'Invalid payment type'}),
	reference_number: z.string().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export const joborderSchema = z.object({
	joborder_id: z.number().optional(),
	joborder_uuid: z.number().optional(),
	reservation_id: z.number().optional(),
	payment_id: z.number().optional(),
	customer_id: z.number().optional(),
	expected_completion_date: z.string(),
	completed_at: z.string().optional(),
	turned_over_at: z.string().optional(),
	status: z.enum([
		'In Progress',
		'Completed',
		'Turned Over',
		'Cancelled',
		'Pending',
	]),

	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),

	customer: customerSchema.optional(),
	services: z.array(serviceSchema).optional(),
	payment: paymentSchema.optional(),
	user_id: z.number().optional(),
});

export type Joborder = z.infer<typeof joborderSchema>;
