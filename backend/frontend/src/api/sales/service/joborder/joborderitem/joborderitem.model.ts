import { z } from 'zod';

export const CreateJobOrderItems = z.object({
  product_id: z.number().min(1),
  job_order_id: z.number().optional(),
  joborder_status: z.string().min(1),
  quantity: z.number().optional(),
});

export const UpdateJobOrderItems = z.object({
  product_id: z.number().min(1),
  job_order_id: z.number().optional(),
  joborder_status: z.string().min(1),
  quantity: z.number().optional(),
});

export type CreateJobOrderItems = z.infer<typeof CreateJobOrderItems>;
export type UpdateJobOrderItems = z.infer<typeof UpdateJobOrderItems>;
