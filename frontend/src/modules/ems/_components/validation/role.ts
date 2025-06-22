import {z} from 'zod';

export const roleSchema = z.object({
	role_id: z.number().optional(),
	name: z.string().min(1),
	last_updated: z.string().optional(),
	created_at: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type Role = z.infer<typeof roleSchema>;
