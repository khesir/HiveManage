import { z } from 'zod';

export const CreateDamageRecord = z.object({
  service_record_id: z.number().min(1),
  product_id: z.number().min(1),
  damage_item_id: z.number().min(1),
  quantity: z.number().min(1),
});
export const UpdateDamageRecord = z.object({
  service_record_id: z.number().min(1),
  product_id: z.number().min(1),
  damage_item_id: z.number().min(1),
  quantity: z.number().min(1),
});

export type CreateDamageRecord = z.infer<typeof CreateDamageRecord>;

export type UpdateDamageRecord = z.infer<typeof UpdateDamageRecord>;
