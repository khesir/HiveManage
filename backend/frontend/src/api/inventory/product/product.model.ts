import { z } from 'zod';

export const CreateProduct = z.object({
  name: z.union([z.string().min(1), z.number()]),
  description: z.union([z.string().min(1), z.number()]),
  re_order_level: z.number(),
  on_listing: z.boolean(),
  total_stocks: z.number(),
  price_history: z.number().min(1),
  inventory_limit: z.number().min(1),
  item_record: z
    .array(
      z.object({
        supplier_id: z.number().optional(),
        condition: z.string().min(1),
        stock: z.string().min(1),
        unit_price: z.string().min(1),
      }),
    )
    .optional(),
  product_categories: z.array(
    z.object({
      category_id: z.number().min(1),
    }),
  ),
});

export const UpdateProduct = z.object({
  category_id: z.number().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  re_order_level: z.number().min(1),
  on_listing: z.boolean(),
});

export type CreateProduct = z.infer<typeof CreateProduct>;
export type UpdateProduct = z.infer<typeof UpdateProduct>;
