import { z } from 'zod';

export const CreateJobOrderServicesService = z.object({
  joborder_type_id: z.number().min(1),
  job_order_id: z.number().optional(),
});

export const UpdateJobOrderServicesService = z.object({
  joborder_type_id: z.number().min(1),
  job_order_id: z.number().optional(),
});

export type CreateJobOrderServicesService = z.infer<
  typeof CreateJobOrderServicesService
>;
export type UpdateJobOrderServicesService = z.infer<
  typeof UpdateJobOrderServicesService
>;
