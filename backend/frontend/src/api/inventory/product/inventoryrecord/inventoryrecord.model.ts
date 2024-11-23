import { z } from 'zod';

export const CreateInventoryRecord = z.object({
  supplier_id: z.number().min(1),
  product_id: z.number().min(1),
  condition: z.string(),
  stock: z.number().min(1),
});

export const UpdateInventoryRecord = z.object({
  supplier_id: z.number().min(1),
  product_id: z.number().min(1),
  condition: z.string().min(1),
  stock: z.number().min(1),
});

export type CreateInventoryRecord = z.infer<typeof CreateInventoryRecord>;
export type UpdateInventoryRecord = z.infer<typeof UpdateInventoryRecord>;
