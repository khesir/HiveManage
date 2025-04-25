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
  re_order_level: z.number().optional(),
  user: z.number().min(1),
});

export const UpdateProduct = z.object({
  name: z.string().optional(),
  is_serialize: z.boolean().optional(),
  status: z.enum(['Unavailable', 'Available']).optional(),
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
  re_order_level: z.number().optional(),
  user: z.number().min(1),
});

export type CreateProduct = z.infer<typeof CreateProduct>;
export type UpdateProduct = z.infer<typeof UpdateProduct>;
