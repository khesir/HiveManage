import { z } from 'zod';

export const CreateTickets = z.object({
  ticket_type_id: z.number().min(1),
  service_id: z.number().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().optional(),
  ticket_status: z.enum(['Resolved', 'Pending', 'Removed']),
  deadline: z.string().optional(),
});

export const UpdateTickets = z.object({
  ticket_type_id: z.number().min(1),
  service_id: z.number().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().optional(),
  ticket_status: z.enum(['Resolved', 'Pending', 'Removed']),
  deadline: z.string().optional(),
});

export type CreateTickets = z.infer<typeof CreateTickets>;
export type UpdateTickets = z.infer<typeof UpdateTickets>;
