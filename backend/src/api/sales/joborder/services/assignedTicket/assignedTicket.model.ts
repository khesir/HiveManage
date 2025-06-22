import { z } from 'zod';

export const CreateAssignedTicket = z.object({
  ticket_id: z.number().optional(),
  employee_id: z.number().min(1),
});

export const UpdatedAssignedTicket = z.object({
  ticket_id: z.number().optional(),
  employee_id: z.number().min(1),
});

export type CreateAssignedTicket = z.infer<typeof CreateAssignedTicket>;
export type UpdatedAssignedTicket = z.infer<typeof UpdatedAssignedTicket>;
