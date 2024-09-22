import { z } from 'zod';

export const CreateJobOrder = z.object({
  employee_id: z.number().min(1),
  service_id: z.number().min(1),
  steps: z.string().min(1),
  required_items: z.string().min(1),
  status: z.string().min(1),
});

export const UpdateJobOrder = z.object({
  employee_id: z.number().min(1),
  service_id: z.number().min(1),
  steps: z.string().min(1),
  required_items: z.string().min(1),
  status: z.string().min(1),
});

export type CreateJobOrder = z.infer<typeof CreateJobOrder>;
export type UpdateJobOrder = z.infer<typeof UpdateJobOrder>;
