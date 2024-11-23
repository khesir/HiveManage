import { z } from 'zod';

export const CreateItemRecord = z.object({
  supplier_id: z.number().min(1),
  product_id: z.number().min(1),
  total_stock: z.number().min(1),
});

export const UpdateItemRecord = z.object({
  supplier_id: z.number().min(1),
  product_id: z.number().min(1),
  total_stock: z.number().min(1),
});

export type CreateItemRecord = z.infer<typeof CreateItemRecord>;
export type UpdateItemRecord = z.infer<typeof UpdateItemRecord>;
