import { z } from 'zod';

export const CreateServiceRecord = z.object({
  product_record_id: z.number().min(1),
  service_item_id: z.number().min(1),
  available_quantity: z.number().min(1),
  on_service_quantity: z.number().min(1),
  sold_quantity: z.number().min(1),
  status: z.enum(['Sold', 'Available']),
});
export const UpdateServiceRecord = z.object({
  product_record_id: z.number().min(1),
  service_item_id: z.number().min(1),
  available_quantity: z.number().min(1),
  on_service_quantity: z.number().min(1),
  sold_quantity: z.number().min(1),
  status: z.enum(['Sold', 'Available']),
});

export type CreateServiceRecord = z.infer<typeof CreateServiceRecord>;

export type UpdateServiceRecord = z.infer<typeof UpdateServiceRecord>;
