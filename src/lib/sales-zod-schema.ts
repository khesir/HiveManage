import {z} from 'zod';
import {EmployeeBasicInformation} from './employee-zod-schema';
import {Customer} from './cms-zod-schema';

export const salesSchema = z.object({
	sales_id: z.number().optional(),
	employee_id: z.number().min(1),
	customer_id: z.number().min(1),
	total_amount: z.number().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type Sales = z.infer<typeof salesSchema>;
export type SalesWithDetails = {
	sales_id: number;
	employee: EmployeeBasicInformation;
	customer: Customer;
	total_amount: number;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
};

export const serviceSchema = z.object({
	service_id: z.number().optional(),
	sales_id: z.number().min(1),
	service_title: z.string().min(1),
	service_description: z.string().min(1),
	service_status: z.enum(['Active', 'Inactive']),
	has_sales_item: z.boolean(),
	has_borrow: z.boolean(),
	has_job_order: z.boolean(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type Service = z.infer<typeof serviceSchema>;
export type ServiceWithDetails = {
	service_id: number;
	sales: SalesWithDetails;
	service_title: string;
	service_description: string;
	service_status: string;
	has_sales_item: boolean;
	has_borrow: boolean;
	has_job_order: boolean;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
};

export const borrowItemSchema = z.object({
	borrow_id: z.number().optional(),
	service_id: z.number().optional(),
	sales_items_id: z.number().optional(),
	borrow_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: 'Invalid date format',
	}),
	return_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: 'Invalid date format',
	}),
	fee: z.number().optional(),
	status: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type Borrow = z.infer<typeof borrowItemSchema>;

export const reservationSchema = z.object({
	reservation_id: z.number().optional(),
	sales_id: z.number().optional(),
	service_id: z.number().optional(),
	item_id: z.number().optional(),
	reserve_status: z.string(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type Reservation = z.infer<typeof reservationSchema>;

export const joborderSchema = z.object({
	jobrder_id: z.number().optional(),
	service_id: z.number().optional(),
	joborder_type_id: z.number().min(1),
	uuid: z.string().min(1),
	fee: z.number().min(1),
	status: z.enum([
		'Pending',
		'In Progress',
		'Completed',
		'On Hold',
		'Cancelled',
		'Awaiting Approval',
		'Approved',
		'Rejected',
		'Closed',
	]),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type Joborder = z.infer<typeof joborderSchema>;

export const joborderTypeschema = z.object({
	joborder_type_id: z.string().optional(),
	name: z.string().min(1),
	description: z.string().min(1),
	joborder_types_status: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type JobOrderType = z.infer<typeof joborderTypeschema>;
