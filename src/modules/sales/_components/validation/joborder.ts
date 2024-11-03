import {EmployeeBasicInformation} from '@/lib/employee-zod-schema';
import {ServiceWithDetails} from '@/lib/sales-zod-schema';
import {z} from 'zod';

export const joborderSchema = z.object({
	jobrder_id: z.number().optional(),
	service_id: z.number().optional(),
	joborder_type_id: z.number().min(1),
	uuid: z.string().min(1),
	fee: z.number().min(1),
	joborder_status: z.enum([
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
	total_cost_price: z.number().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type Joborder = z.infer<typeof joborderSchema>;

export type JobOrderWithDetails = {
	joborder_id?: number;
	service: ServiceWithDetails;
	joborder_type: JoborderServiceWithDetails[];
	joborder_assign: AssignEmployeeWithDetails[];
	uuid: string;
	fee: number;
	joborder_status: string;
	total_cost_price: number;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
};
export const joborderServiceSchema = z.object({
	joborder_service_id: z.number().optional(),
	joborder_id: z.number().min(1),
	joborder_type_id: z.number().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type JoborderService = z.infer<typeof joborderServiceSchema>;

export type JoborderServiceWithDetails = {
	joborder_service_id?: number;
	joborder_id: number;
	joborder_type: JobOrderType;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
};

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
