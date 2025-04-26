import { z } from 'zod';

export const CreateSerializeServiceItem = z.object({
  serial_id: z.number().min(1),
  service_item_id: z.number().min(1),
  quantity: z.number().min(1),
  status: z.enum(['Sold', 'Available']),
});
export const UpdateSerializeServiceItem = z.object({
  serial_id: z.number().min(1),
  service_item_id: z.number().min(1),
  quantity: z.number().min(1),
  status: z.enum(['Sold', 'Available']),
});

export type CreateSerializeServiceItem = z.infer<
  typeof CreateSerializeServiceItem
>;

export type UpdateSerializeServiceItem = z.infer<
  typeof UpdateSerializeServiceItem
>;
