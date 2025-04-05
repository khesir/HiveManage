import { z } from 'zod';

export const CreateService = z.object({
  service_type_id: z.number().min(1),
  uuid: z.string().min(1),
  fee: z.number().min(1),
  description: z.string().min(1),
  customer_id: z.number().optional(),
  service_status: z.enum(['Pending', 'In Progress', 'Complete']),
  total_price_cost: z.number().optional(),
});

export const UpdateService = z.object({
  service_type_id: z.number().min(1),
  uuid: z.string().min(1),
  fee: z.number().min(1),
  description: z.string().min(1),
  customer_id: z.number().optional(),
  service_status: z.enum(['Pending', 'In Progress', 'Complete']),
  total_price_cost: z.number().optional(),
});

export type CreateService = z.infer<typeof CreateService>;
export type UpdateService = z.infer<typeof UpdateService>;
