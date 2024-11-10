import {z} from 'zod';

export const positionSchema = z.object({
	position_id: z.number().optional(),
	name: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type Position = z.infer<typeof positionSchema>;
