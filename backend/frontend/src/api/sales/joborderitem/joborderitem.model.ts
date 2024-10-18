import { z } from 'zod';

export const CreateJobOrderItems = z.object({
  item_id: z.number().min(1),
  job_order_id: z.number().min(1),
  quantity: z.number().min(1),
});

export const UpdateJobOrderItems = z.object({
  item_id: z.number().min(1),
  job_order_id: z.number().min(1),
  quantity: z.number().min(1),
});

export type CreateJobOrderItems = z.infer<typeof CreateJobOrderItems>;
export type UpdateJobOrderItems = z.infer<typeof UpdateJobOrderItems>;
