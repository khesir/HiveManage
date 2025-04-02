import { z } from 'zod';

export const CreateOrderTransactionLog = z.object({
  order_id: z.number(),
  order_item_id: z.number(),
  action: z.string(),
  quantity: z.number(),
  performed_by_id: z.number(),
  timestamp: z.date().default(() => new Date()),
});

export const UpdateOrderTransactionLog = z.object({
  order_id: z.number(),
  order_item_id: z.number(),
  action: z.string(),
  quantity: z.number(),
  performed_by_id: z.number(),
  timestamp: z.date().default(() => new Date()),
});

export type CreatePCreateOrderTransactionLogroduct = z.infer<
  typeof CreateOrderTransactionLog
>;
export type UpdateOrderTransactionLog = z.infer<
  typeof UpdateOrderTransactionLog
>;
