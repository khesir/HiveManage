import {z} from 'zod';
import {Joborder} from './joborder';
import {EmployeeBasicInformation} from '@/modules/ems/_components/validation/employee-zod-schema';
import {ItemWithDetails} from '@/lib/inventory-zod-schema';

export const taskSchema = z.object({
	remark_id: z.number().optional(),
	remark_type_id: z.number().min(1),
	job_order_id: z.number().optional(),
	title: z.string().min(1),
	description: z.string().min(1),
	content: z.string().optional(),
	remarkticket_status: z.string().min(1),
	deadline: z.string().optional(),
	created_by: z.number().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type Task = z.infer<typeof taskSchema>;

export type TaskWithDetails = {
	remark_id: number;
	remark_type: TaskType;
	remark_assign: TaskAssignWithDetails[];
	joborder: Joborder;
	description: string;
	title: string;
	content?: TaskContent;
	created_by: EmployeeBasicInformation;
	remarkticket_status: string;
	deadline?: string;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
};

export const taskContentSchema = z.object({
	remarkcontent_id: z.number().optional(),
	markdown: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type TaskContent = z.infer<typeof taskContentSchema>;

export const taskTypeSchema = z.object({
	remark_type_id: z.number().optional(),
	name: z.string().min(1),
	description: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type TaskType = z.infer<typeof taskTypeSchema>;

export const taskAssignSchema = z.object({
	remarkassigned_id: z.number().optional(),
	remark_id: z.number(),
	employee_id: z.number(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type TaskAssign = z.infer<typeof taskAssignSchema>;

export type TaskAssignWithDetails = {
	remarkassigned_id?: number;
	remark_id: number;
	employee: EmployeeBasicInformation;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
};

export const taskItemsSchema = z.object({
	remark_items_id: z.number().optional(),
	items_id: z.number().min(1),
	remark_id: z.number().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type TaskItems = z.infer<typeof taskItemsSchema>;

export type TaskItemsWithDetails = {
	remark_items_id?: number;
	item: ItemWithDetails;
	remark_id: number;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
};
