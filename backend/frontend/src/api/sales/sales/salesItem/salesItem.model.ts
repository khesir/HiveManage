import { z } from 'zod';

// Define your Zod schema for CreateSalesItem
export const CreateSalesItem = z.object({
  product_id: z.number().min(1),
  sales_id: z.number().min(1),
  quantity: z.number().min(1),
  salesItem_type: z.enum(['Sales', 'Job Order', 'Borrow', 'Purchase']),
  total_price: z.number().min(1),
});

export const UpdateSalesItem = z.object({
  product_id: z.number().min(1),
  sales_id: z.number().min(1),
  quantity: z.number().min(1),
  salesItem_type: z.enum(['Sales', 'Job Order', 'Borrow', 'Purchase']),
  total_price: z.number().min(1),
});

export type CreateSalesItem = z.infer<typeof CreateSalesItem>;
export type UpdateSalesItem = z.infer<typeof UpdateSalesItem>;
