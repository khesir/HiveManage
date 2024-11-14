import { z } from 'zod';

export const CreateProduct = z.object({
  category_id: z.number().min(1),
  supplier_id: z.number().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  re_order_level: z.number().min(1),
  on_listing: z.boolean(),
});

export const UpdateProduct = z.object({
  category_id: z.number().min(1),
  supplier_id: z.number().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  re_order_level: z.number().min(1),
  on_listing: z.boolean(),
});

export type CreateProduct = z.infer<typeof CreateProduct>;
export type UpdateProduct = z.infer<typeof UpdateProduct>;
