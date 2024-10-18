import { z } from 'zod';

export const CreateAssignedEmployees = z.object({
  job_order_id: z.number().min(1),
  employee_id: z.number().min(1),
  assigned_by: z.string().min(1),
});

export const UpdateAssignedEmployees = z.object({
  job_order_id: z.number().min(1),
  employee_id: z.number().min(1),
  assigned_by: z.string().min(1),
});

export type CreateAssignedEmployees = z.infer<typeof CreateAssignedEmployees>;
export type UpdateAssignedEmployees = z.infer<typeof UpdateAssignedEmployees>;
