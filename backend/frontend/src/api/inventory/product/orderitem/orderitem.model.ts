import { z } from 'zod';

export const CreateOrderItem = z.object({
  order_id: z.number().min(1),
  product_id: z.number().min(1),
  supplier_id: z.number().min(1),
  quantity: z.number().min(1),
  price: z.number().min(1),
});

export const UpdateOrderItem = z.object({
  order_id: z.number().min(1),
  product_id: z.number().min(1),
  supplier_id: z.number().min(1),
  quantity: z.number().min(1),
  price: z.number().min(1),
});

export type CreateOrderItem = z.infer<typeof CreateOrderItem>;
export type UpdateOrderItem = z.infer<typeof UpdateOrderItem>;
