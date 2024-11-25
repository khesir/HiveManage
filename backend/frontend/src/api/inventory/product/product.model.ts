import { z } from 'zod';

export const CreateProduct = z.object({
  name: z.union([z.string().min(1), z.number()]),
  description: z.union([z.string().min(1), z.number()]),
  stock_limit: z.number().min(1),
  product_categories: z
    .array(
      z.object({
        category_id: z.number(),
      }),
    )
    .optional(),
});

export const UpdateProduct = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  stock_limit: z.number().min(1),
});

export type CreateProduct = z.infer<typeof CreateProduct>;
export type UpdateProduct = z.infer<typeof UpdateProduct>;
