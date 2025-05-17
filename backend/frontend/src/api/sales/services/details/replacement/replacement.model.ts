import { z } from 'zod';

export const CreateReplacement = z.object({
  replacement_id: z.number().optional(),
  service_id: z.number(),
  owned_items: z.array(z.number()).default([]),
  new_product: z.array(z.number()).default([]),
  reason: z.string().optional().nullable(),
});
export const UpdateReplacement = z.object({
  replacement_id: z.number().optional(),
  service_id: z.number(),
  owned_items: z.array(z.number()).default([]),
  new_product: z.array(z.number()).default([]),
  reason: z.string().optional().nullable(),
});
export type CreateReplacement = z.infer<typeof CreateReplacement>;
export type UpdateReplacement = z.infer<typeof UpdateReplacement>;
