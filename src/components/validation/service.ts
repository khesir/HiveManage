import {z} from 'zod';

const serviceTypeSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
});

const customerSchema = z.object({
	customer_id: z.number().optional(),
	firstname: z.string().optional(),
	middlename: z.string().optional(),
	lastname: z.string().optional(),
	contact_phone: z.string().optional(),
	email: z.string().optional(),
	socials: z
		.array(
			z.object({
				type: z.string().optional(),
				link: z.string().optional(),
			}),
		)
		.optional(),
	addressline: z.string().optional(),
	barangay: z.string().optional(),
	province: z.string().optional(),
	standing: z.string().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
const employeeSchema = z.object({
	employee_id: z.number().optional(),
	position_id: z.string().optional(),
	firstname: z.string().optional(),
	middlename: z.string().optional(),
	lastname: z.string().optional(),
	email: z.string().optional(),
	profile_link: z.string().optional(),
	role_id: z.string().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

const assignedEmployeeSchema = z.object({
	service_id: z.number().optional(),
	employee_id: z.number().optional(),
	is_leader: z.boolean().optional(),
	assigned_by: z.string().optional(),
	employee: employeeSchema.optional(),
});
const paymentSchema = z.object({
	payment_id: z.number().optional(),
	service_id: z.number().optional(),
	sales_id: z.number().optional(),
	amount: z.number().optional(),
	vat_amount: z.number().optional(),
	discount_amount: z.number().optional(),
	paid_amount: z.number().optional(),
	change_amount: z.number().optional(),
	payment_date: z.string().optional(),
	payment_method: z.string().optional(),
	payment_type: z.string().optional(),
	reference_number: z.string().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export const serviceSchema = z.object({
	service_id: z.number().optional(),
	service_type_id: z.number().min(1),
	uuid: z.string().min(1),
	fee: z.number().min(0),
	description: z.string().min(1),
	customer_id: z.number().optional(),
	service_status: z.enum(['Pending', 'In Progress', 'Complete']),
	total_cost_price: z.number().optional(),

	customer: customerSchema.optional(),
	service_type: serviceTypeSchema.optional(),
	assigned: z.array(assignedEmployeeSchema).optional(),
	payment: paymentSchema.optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),

	user_id: z.number().min(1),
});

export type Service = z.infer<typeof serviceSchema>;
