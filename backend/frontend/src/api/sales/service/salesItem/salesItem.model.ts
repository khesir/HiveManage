import { z } from 'zod';

// Define your Zod schema for CreateSalesItem
export const CreateSalesItem = z.object({
  item_id: z.number().min(1),
  service_id: z.number().min(1),
  quantity: z.number().min(1),
  sales_item_type: z.enum([
    'Sales',
    'Joborder',
    'Borrow',
    'Purchase',
    'Exchange',
  ]),
  total_price: z.number().min(1),
});

export const UpdateSalesItem = z.object({
  item_id: z.number().min(1),
  service_id: z.number().min(1),
  quantity: z.number().min(1),
  sales_item_type: z.enum([
    'Sales',
    'Joborder',
    'Borrow',
    'Purchase',
    'Exchange',
  ]),
  total_price: z.number().min(1),
});

export type CreateSalesItem = z.infer<typeof CreateSalesItem>;
export type UpdateSalesItem = z.infer<typeof UpdateSalesItem>;
