import { z } from 'zod';
const productSchema = z.object({
  product_id: z.number().optional(),
  name: z.string(),
  is_serialize: z.boolean(),
  status: z.enum(['Unavailable', 'Available']),
  product_categories: z
    .array(
      z.object({
        category_id: z.number().optional(),
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
  selling_price: z.string().optional(),
});
const createSerializeSchema = z.object({
  serial_id: z.number().optional(),
  product_id: z.number().optional(),
  supplier_id: z.number().optional(),
  serial_code: z.string().optional().nullable(),
  warranty_date: z.string().optional().nullable(),
  condition: z.enum(['New', 'Secondhand', 'Broken']).optional(),
  status: z
    .enum([
      'Sold',
      'Available',
      'In Service',
      'On Order',
      'Returned',
      'Damage',
      'Retired',
    ])
    .optional(),
});
export const CreateServiceItem = z.object({
  service_id: z.number().min(1),
  product_id: z.number().min(1),
  serialize_items: z.array(createSerializeSchema).optional(),

  quantity: z.number().min(1),
  sold_price: z.number(),
  status: z.enum(['Pending', 'Used', 'Sold', 'Returned']),
  user_id: z.number().min(1),
  product: productSchema.optional(),
});
export const UpdateServiceItem = z.object({
  service_id: z.number().min(1),
  product_id: z.number().min(1),
  serialize_items: z.array(createSerializeSchema).optional(),

  quantity: z.number().min(1),
  sold_price: z.number(),
  status: z.enum(['Pending', 'Used', 'Sold', 'Returned']),
  user_id: z.number().min(1),
  product: productSchema.optional(),
});

export type CreateServiceItem = z.infer<typeof CreateServiceItem>;

export type UpdateServiceItem = z.infer<typeof UpdateServiceItem>;
