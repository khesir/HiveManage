import { z } from 'zod';

export const CreateProductTransactionLog = z.object({
  product_id: z.number(),
  product_record_id: z.number(),
  serial_id: z.number(),
  action: z.string(),
  quantity: z.number(),
  performed_by_id: z.number(),
  timestamp: z.date().default(() => new Date()),
});

export const UpdateProductTransactionLog = z.object({
  product_id: z.number(),
  product_record_id: z.number(),
  serial_id: z.number(),
  action: z.string(),
  quantity: z.number(),
  performed_by_id: z.number(),
  timestamp: z.date().default(() => new Date()),
});

export type CreateProductTransactionLog = z.infer<
  typeof CreateProductTransactionLog
>;
export type UpdateProductTransactionLog = z.infer<
  typeof UpdateProductTransactionLog
>;
