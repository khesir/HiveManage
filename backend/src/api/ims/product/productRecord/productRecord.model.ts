import { z } from 'zod';

export const CreateProductRecord = z.object({
  product_id: z.number().min(1),
  supplier_id: z.number().min(1),
  order_item_id: z.number().min(1),

  quantity: z.number().min(1),
  status: z.enum(['Pending', 'Confirmed', 'Returned', 'Added']),
  action_type: z.enum(['Received', 'Returned', 'Transferred']),
  handled_by: z.number().min(1),
});

export const UpdateProductRecord = z.object({
  product_id: z.number().min(1),
  supplier_id: z.number().min(1),
  order_item_id: z.number().min(1),

  quantity: z.number().min(1),
  status: z.enum(['Pending', 'Confirmed', 'Returned', 'Added']),
  handled_by: z.number().min(1),
});

export type CreateProductRecord = z.infer<typeof CreateProductRecord>;
export type UpdateProductRecord = z.infer<typeof UpdateProductRecord>;
