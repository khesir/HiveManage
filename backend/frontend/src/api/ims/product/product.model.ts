import { z } from 'zod';

export const CreateProduct = z.object({
  name: z.string(),
  is_serialize: z.boolean(),
  status: z.enum(['Unavailable', 'Available']),
  product_categories: z
    .array(
      z.object({
        category_id: z.number(),
      }),
    )
    .optional(),
  product_details: z
    .object({
      description: z.string(),
      color: z.string(),
      size: z.string(),
    })
    .optional(),
});

export const UpdateProduct = z.object({
  supplier_id: z.number().min(1),
  product_details_id: z.number().min(1),
  name: z.string(),

  is_serialize: z.boolean(),
  status: z.enum(['Unavailable', 'Available']),
});

export type CreateProduct = z.infer<typeof CreateProduct>;
export type UpdateProduct = z.infer<typeof UpdateProduct>;
