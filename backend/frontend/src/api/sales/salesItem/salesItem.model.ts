import { z } from 'zod';

export const CreateSalesItem = z.object({
  sales_id: z.number().min(1),
  item_id: z.number().min(1),
  quantity: z.number().min(1),
  is_service_item: z.string().min(1),
  total_price: z.number().min(1),
});

export const UpdateSalesItem = z.object({
  sales_id: z.number().min(1),
  item_id: z.number().min(1),
  quantity: z.number().min(1),
  is_service_item: z.string().min(1),
  total_price: z.number().min(1),
});

export type CreateSalesItem = z.infer<typeof CreateSalesItem>;
export type UpdateSalesItem = z.infer<typeof UpdateSalesItem>;
