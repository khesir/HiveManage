import { z } from 'zod';

export const CreateProductCategory = z.object({
  product_id: z.number().min(1),
  category_id: z.number().min(1),
});

export const UpdateProductCategory = z.object({
  product_id: z.number().min(1),
  category_id: z.number().min(1),
});

export type CreateProductCategory = z.infer<typeof CreateProductCategory>;
export type UpdateProductCategory = z.infer<typeof UpdateProductCategory>;
