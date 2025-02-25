import { z } from 'zod';

export const CreateProduct = z.object({
  supplier_id: z.number().min(1),
  product_details_id: z.number().min(1),
  name: z.string(),
  is_serialize: z.boolean(),
  status: z.enum(['Unavailable', 'Available']),
});

export const UpdateProduct = z.object({
  supplier_id: z.number().min(1),
  product_details_id: z.number().min(1),
  name: z.string(),

  is_serialize: z.boolean(),
  itemStatus: z.enum(['Unavailable', 'Available']),
});

export type CreateProduct = z.infer<typeof CreateProduct>;
export type UpdateProduct = z.infer<typeof UpdateProduct>;
