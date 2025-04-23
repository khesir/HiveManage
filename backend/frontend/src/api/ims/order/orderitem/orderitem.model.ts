import { z } from 'zod';

const orderItemStatus = z.enum([
  'Draft',
  'Finalized',
  'Awaiting Arrival',
  'Partially Delivered',
  'Delivered',
  'Cancelled',
  'Returned',
  'Stocked',
]);

export const UpdateOrderItem = z.object({
  order_product_id: z.number().optional(),
  order_id: z.number().optional(),
  product_id: z.number().min(1),
  total_quantity: z.number().min(1),
  ordered_quantity: z.number().optional(),
  delivered_quantity: z.number().optional(),
  unit_price: z.string().min(1),
  is_serialize: z.boolean().optional(),
  status: orderItemStatus.optional(),
  user: z.number().min(1),
});

export const CreateOrderItem = z.object({
  order_product_id: z.number().optional(),
  order_id: z.number().optional(),
  product_id: z.number().min(1),

  total_quantity: z.number().min(1),
  ordered_quantity: z.number().optional(),
  delivered_quantity: z.number().optional(),
  unit_price: z.string().min(1),
  is_serialize: z.boolean().optional(),
  status: orderItemStatus.optional(),
  user: z.number().min(1),
});

export type CreateOrderItem = z.infer<typeof CreateOrderItem>;
export type UpdateOrderItem = z.infer<typeof UpdateOrderItem>;

export const UpdateStatus = z.object({
  status: z.string().min(1),
});
export type UpdateStatus = z.infer<typeof UpdateStatus>;
