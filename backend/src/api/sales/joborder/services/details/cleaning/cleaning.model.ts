import { z } from 'zod';

export const CreateCleaning = z.object({
  cleaning_id: z.number().optional(),
  service_id: z.number(),
  method: z.string(),
  notes: z.string(),
});
export const UpdateCleaning = z.object({
  cleaning_id: z.number().optional(),
  service_id: z.number().optional(),
  method: z.string(),
  notes: z.string(),
});
export type CreateCleaning = z.infer<typeof CreateCleaning>;
export type UpdateCleaning = z.infer<typeof UpdateCleaning>;
