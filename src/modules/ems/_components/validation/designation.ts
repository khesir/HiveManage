import {z} from 'zod';

export const DesignationSchema = z.object({
	designation_id: z.number(),
	title: z.string(),
	status: z.string(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type Designation = z.infer<typeof DesignationSchema>;
