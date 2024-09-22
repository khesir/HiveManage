import { z } from 'zod';

export const CreateService = z.object({
  sales_id: z.number().min(1),
  service_title: z.string().min(1),
  service_type: z.string().min(1),
});

export const UpdateService = z.object({
  sales_id: z.number().min(1),
  service_title: z.string().min(1),
  service_type: z.string().min(1),
});

export type CreateService = z.infer<typeof CreateService>;
export type UpdateService = z.infer<typeof UpdateService>;
