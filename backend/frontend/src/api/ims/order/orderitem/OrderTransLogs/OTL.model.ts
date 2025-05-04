import { z } from 'zod';

export const CreateOrderTransactionLog = z.object({
  order_id: z.number(),
  order_item_id: z.number(),
  product_id: z.number(),
  total_quantity: z.number(),
  ordered_quantity: z.number(),
  delivered_quantity: z.number(),
  resolved_quantity: z.number(),

  status: z.enum(['Delivered', 'Pending', 'Resolved', 'Approved', 'Refunded']),
  action_type: z.enum(['Added to inventory', 'Resolved', 'Returned']),
  performed_by: z.number(),
});

export const UpdateOrderTransactionLog = z.object({
  order_id: z.number(),
  order_item_id: z.number(),
  product_id: z.number(),
  total_quantity: z.number(),
  ordered_quantity: z.number(),
  delivered_quantity: z.number(),
  resolved_quantity: z.number(),

  status: z.enum(['Delivered', 'Pending', 'Resolved', 'Refunded']),
  action_type: z.enum(['Added to inventory', 'Resolved', 'Returned']),
  performed_by: z.number(),
});

export type CreateOrderTransactionLog = z.infer<
  typeof CreateOrderTransactionLog
>;
export type UpdateOrderTransactionLog = z.infer<
  typeof UpdateOrderTransactionLog
>;
