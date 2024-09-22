import { z } from 'zod';

export const CreateItem = z.object({
  product_id: z.number().min(1),
  stock: z.number().min(1),
  re_order_level: z.number().min(1),
});

export const UpdateItem = z.object({
  product_id: z.number().min(1),
  stock: z.number().min(1),
  re_order_level: z.number().min(1),
});

export type CreateItem = z.infer<typeof CreateItem>;
export type UpdateItem = z.infer<typeof UpdateItem>;
