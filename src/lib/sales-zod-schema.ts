import {z} from 'zod';
import {EmployeeBasicInformation} from '../modules/ems/_components/validation/employee';
import {Customer} from './cms-zod-schema';
import {ItemWithDetails, Product} from '../modules/inventory/_components/validation/product';

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
	customer_id: z.number().min(1),
	employee_id: z.number().min(1),
	service_title: z.string().min(1),
	service_description: z.string().min(1),
	service_status: z.enum(['Active', 'Inactive']),
	has_reservation: z.boolean(),
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
	customer: Customer;
	employee: EmployeeBasicInformation;
	service_title: string;
	service_description: string;
	service_status: string;
	has_reservation: boolean;
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

export const salesItemSchema = z.object({
	sales_item_id: z.number().optional(),
	service_id: z.number().min(1),
	item_id: z.number().min(1),
	quantity: z.number().min(1),
	sales_item_type: z.enum([
		'Sales',
		'Joborder',
		'Borrow',
		'Purchase',
		'Exchange',
	]),
	total_price: z.number().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type SalesItem = z.infer<typeof salesItemSchema>;

export type SalesItemWithDetails = {
	sales_item_id?: number;
	service: ServiceWithDetails;
	product: Product;
	quantity: number;
	sales_item_type: string;
	total_price: number;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
};

export const assignedEmployeesSchema = z.object({
	assigned_employee_id: z.number().optional(),
	job_order_id: z.number().optional(),
	employee_id: z.number().min(1),
	assigned_by: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type AssignEmployee = z.infer<typeof assignedEmployeesSchema>;

export type AssignEmployeeWithDetails = {
	assigned_employee_id?: number;
	job_order_id: number;
	employee: EmployeeBasicInformation;
	assigned_by: string;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
};
