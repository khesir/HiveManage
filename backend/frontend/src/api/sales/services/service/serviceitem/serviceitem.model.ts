import { z } from 'zod';

export const CreateServiceItem = z.object({
  product_id: z.number().min(1),
  service_id: z.number().min(1),
  product_record_id: z.number().min(1),
  serial_id: z.number().min(1),
  serviceitem_status: z.string().min(1),
  quantity: z.number().min(1),
});

export const UpdateServiceItem = z.object({
  product_id: z.number().min(1),
  service_id: z.number().min(1),
  product_record_id: z.number().min(1),
  serial_id: z.number().min(1),
  serviceitem_status: z.string().min(1),
  quantity: z.number().min(1),
});

export type CreateServiceItem = z.infer<typeof CreateServiceItem>;
export type UpdateServiceItem = z.infer<typeof UpdateServiceItem>;
