import {z} from 'zod';

export const serviceTypeSchema = z.object({
	service_type_id: z.number().optional(),

	name: z.string().min(1),
	description: z.string().min(1),

	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type ServiceType = z.infer<typeof serviceTypeSchema>;
