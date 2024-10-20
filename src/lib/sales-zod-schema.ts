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
	service_type: z.enum([
		'Repair',
		'Sell',
		'Buy',
		'Borrow',
		'Return',
		'Exchange',
	]),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type Service = z.infer<typeof serviceSchema>;
export type ServiceWithDetails = {
	service_id: number;
	sales: SalesWithDetails;
	service_title: string;
	service_type: string;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
};

export const borrowItemSchema = z.object({
	borrow_id: z.number().optional(),
	sales_id: z.number().min(1),
	service_id: z.number().optional(),
	sales_items_id: z.number().min(1),
	borrow_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: 'Invalid date format',
	}),
	return_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: 'Invalid date format',
	}),
	fee: z.number().min(1),
	status: z.enum([
		'Requested',
		'Approved',
		'Borrowed',
		'Returned',
		'Overdue',
		'Rejected',
		'Cancelled',
		'Lost',
		'Damaged',
	]),

	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type Borrow = z.infer<typeof borrowItemSchema>;

export const reservationSchema = z.object({
	reservation_id: z.number().optional(),
	sales_id: z.number().min(1),
	service_id: z.number().optional(),
	item_id: z.number().optional(),
	reserve_status: z.enum([
		'Pending',
		'Reserved',
		'Confirmed',
		'Cancelled',
		'Completed',
	]),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type Reservation = z.infer<typeof reservationSchema>;

export const joborderSchema = z.object({
	jobrder_id: z.number().optional(),
	joborder_type_id: z.number().min(1),
	service_id: z.number().optional(),
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
