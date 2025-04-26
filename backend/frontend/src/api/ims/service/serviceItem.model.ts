import { z } from 'zod';

export const CreateServiceItem = z.object({
  product_id: z.number().min(1),
  service_type_id: z.number().min(1),
  quantity: z.number().min(1),
  status: z.enum(['Sold Out', 'Available']),
});
export const UpdateServiceItem = z.object({
  product_id: z.number().min(1),
  service_type_id: z.number().min(1),
  quantity: z.number().min(1),
  status: z.enum(['Sold Out', 'Available']),
});

export type CreateServiceItem = z.infer<typeof CreateServiceItem>;

export type UpdateServiceItem = z.infer<typeof UpdateServiceItem>;
