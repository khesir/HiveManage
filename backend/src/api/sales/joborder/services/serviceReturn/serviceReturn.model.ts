import { z } from 'zod';

export const CreateServiceReturn = z.object({
  return_id: z.number().optional(),
  original_service_id: z.number(),
  new_service_id: z.number(),
  reason: z.string(),
  under_warranty: z.boolean(),
  returned_at: z.string(),
});
export const UpdateServiceReturn = z.object({
  return_id: z.number().optional(),
  original_service_id: z.number(),
  new_service_id: z.number(),
  reason: z.string(),
  under_warranty: z.boolean(),
  returned_at: z.string(),
});
export type CreateServiceReturn = z.infer<typeof CreateServiceReturn>;
export type UpdateServiceReturn = z.infer<typeof UpdateServiceReturn>;
