import { z } from 'zod';

export const CreateTicketType = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export const UpdateTicketType = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export type CreateTicketType = z.infer<typeof CreateTicketType>;
export type UpdateTicketType = z.infer<typeof UpdateTicketType>;
