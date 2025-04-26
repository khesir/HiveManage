import { z } from 'zod';

export const CreateTranServiceItem = z.object({
  service_record_id: z.number().min(1),
  service_id: z.number().min(1),
  quantity: z.number().min(1),
});

export const UpdateTranServiceItem = z.object({
  service_record_id: z.number().min(1),
  service_id: z.number().min(1),
  quantity: z.number().min(1),
});

export type CreateTranServiceItem = z.infer<typeof CreateTranServiceItem>;
export type UpdateTranServiceItem = z.infer<typeof UpdateTranServiceItem>;
