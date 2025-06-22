import {z} from 'zod';

export const DepartmentSchema = z.object({
	department_id: z.number().optional(),
	name: z.string().min(1, ''),
	status: z.string().min(1, ''),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type Department = z.infer<typeof DepartmentSchema>;
