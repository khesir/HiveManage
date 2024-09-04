import { z } from 'zod';

// Validation Schema
export const CreateActivityLog = z.object({
  employee_id: z.number().min(1),
  action: z.string().min(1),
});
export const UpdateActivityLog = z.object({
  employee_id: z.number().min(1).optional(),
  action: z.string().min(1).optional(),
});

export type CreateActivityLog = z.infer<typeof CreateActivityLog>;
export type UpdateActivityLog = z.infer<typeof UpdateActivityLog>;
