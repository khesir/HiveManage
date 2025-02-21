import { z } from 'zod';

export const CreateProduct = z.object({
  supplier_id: z.number().min(1),
  product_details_id: z.number().min(1),
  price: z.number().min(1),
  discount: z.number().min(1),
  is_serialize: z.boolean(),
  itemStatus: z.enum([
    'Unavailable',
    'Sold',
    'Available',
    'Returned',
    'Pending Payment',
    'On Order',
    'In Service',
    'Awaiting Service',
    'Return Requested',
    'Retired',
  ]),
});

export const UpdateProduct = z.object({
  supplier_id: z.number().min(1),
  product_details_id: z.number().min(1),
  price: z.number().min(1),
  discount: z.number().min(1),
  is_serialize: z.boolean(),
  itemStatus: z.enum([
    'Unavailable',
    'Sold',
    'Available',
    'Returned',
    'Pending Payment',
    'On Order',
    'In Service',
    'Awaiting Service',
    'Return Requested',
    'Retired',
  ]),
});

export type CreateProduct = z.infer<typeof CreateProduct>;
export type UpdateProduct = z.infer<typeof UpdateProduct>;
