import {z} from 'zod';

export const ticketTypeSchema = z.object({
	ticket_type_id: z.number().optional(),

	name: z.string().min(1),
	description: z.string().min(1),

	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type TicketType = z.infer<typeof ticketTypeSchema>;
