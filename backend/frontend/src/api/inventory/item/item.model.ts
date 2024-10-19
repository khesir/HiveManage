import { z } from 'zod';

export const CreateItem = z.object({
  product_id: z.number().min(1),
  stock: z.number().min(1),
  on_listing: z.boolean(),
  re_order_level: z.number().min(1),
  tag: z.enum(['New', 'Used', 'Broken']),
});

export const UpdateItem = z.object({
  product_id: z.number().min(1),
  stock: z.number().min(1),
  on_listing: z.boolean(),
  re_order_level: z.number().min(1),
  tag: z.enum(['New', 'Used', 'Broken']),
});

export type CreateItem = z.infer<typeof CreateItem>;
export type UpdateItem = z.infer<typeof UpdateItem>;
