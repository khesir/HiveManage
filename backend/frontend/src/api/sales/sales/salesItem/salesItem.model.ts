import { z } from 'zod';

// Define your Zod schema for CreateSalesItem
export const CreateSalesItem = z.object({
  product_id: z.number().min(1),
  sales_id: z.number().min(1),
  product_record_id: z.number().min(1),
  serial_id: z.number().min(1),
  quantity: z.number().min(1),
  total_price: z.number().min(1),
  sold_price: z.number().min(1),
});

export const UpdateSalesItem = z.object({
  product_id: z.number().min(1),
  sales_id: z.number().min(1),
  quantity: z.number().min(1),
  sold_price: z.number().min(1),

  return_qty: z.number().optional(),
  refund_amount: z.number().optional(),
  return_note: z.string().optional(),
  warranty_date: z.string().optional(),
  warranty_used: z.boolean().default(false),

  user_id: z.number(),
});

export type CreateSalesItem = z.infer<typeof CreateSalesItem>;
export type UpdateSalesItem = z.infer<typeof UpdateSalesItem>;
