import { z } from 'zod';

export const UpdateOrderItem = z.object({
  order_id: z.number().optional(),
  product_id: z.number().min(1),
  quantity: z.number().min(1),
  price: z.string().min(1),
});

export const CreateOrderItem = z.object({
  order_id: z.number().optional(),
  product_id: z.number().min(1),
  quantity: z.number().min(1),
  price: z.string().min(1),
});

export type CreateOrderItem = z.infer<typeof CreateOrderItem>;
export type UpdateOrderItem = z.infer<typeof UpdateOrderItem>;

export const UpdateStatus = z.object({
  status: z.string().min(1),
});
export type UpdateStatus = z.infer<typeof UpdateStatus>;
