import {z} from 'zod';
import {EmployeeBasicInformation} from './employee-zod-schema';

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

export const customerSchema = z.object({
	customer_id: z.string().optional(),
	firstname: z.string().min(1),
	lastname: z.string().min(1),
	contact_phone: z.string().min(1),
	socials: z.string().min(1),
	address_line: z.string().min(1),
	barangay: z.string().min(1),
	province: z.string().min(1),
	standing: z.enum([
		'Active',
		'Inactive',
		'Pending',
		'Suspended',
		'Banned',
		'VIP',
		'Delinquent',
		'Prospect',
	]),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type Customer = z.infer<typeof customerSchema>;
