import { z } from 'zod';

export const CreateDamageItem = z.object({
  product_id: z.number().min(1),
  quantity: z.number().min(1),
});
export const UpdateDamageItem = z.object({
  product_id: z.number().min(1),
  quantity: z.number().min(1),
});

export type CreateDamageItem = z.infer<typeof CreateDamageItem>;

export type UpdateDamageItem = z.infer<typeof UpdateDamageItem>;
