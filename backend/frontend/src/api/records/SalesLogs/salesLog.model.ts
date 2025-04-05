import { z } from 'zod';

export const CreateSalesLog = z.object({
  sales_id: z.number(),
  payment_id: z.number(),
  sales_items_id: z.number(),
  action: z.string(),
  quantity: z.number(),
  performed_by_id: z.number(),
  timestamp: z.date().default(() => new Date()),
});

export const UpdateSalesLog = z.object({
  sales_id: z.number(),
  payment_id: z.number(),
  sales_items_id: z.number(),
  action: z.string(),
  quantity: z.number(),
  performed_by_id: z.number(),
  timestamp: z.date().default(() => new Date()),
});

export type CreateSalesLog = z.infer<typeof CreateSalesLog>;
export type UpdateSalesLog = z.infer<typeof UpdateSalesLog>;
