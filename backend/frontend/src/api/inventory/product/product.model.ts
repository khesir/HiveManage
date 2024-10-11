import { z } from 'zod';

export const CreateProduct = z.object({
  category_id: z.number().min(1),
  supplier_id: z.number().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().multipleOf(0.01),
  img_url: z.string().optional(),
});

export const UpdateProduct = z.object({
  category_id: z.number().min(1),
  supplier_id: z.number().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().multipleOf(0.01),
  img_url: z.string().optional(),
});

export type CreateProduct = z.infer<typeof CreateProduct>;
export type UpdateProduct = z.infer<typeof UpdateProduct>;
