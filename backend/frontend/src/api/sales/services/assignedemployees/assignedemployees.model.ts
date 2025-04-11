import { z } from 'zod';

export const CreateAssignedEmployees = z.object({
  service_id: z.number().optional(),
  employee_id: z.number().min(1),
  is_leader: z.boolean(),
  assigned_by: z.number().min(1),
});

export const UpdateAssignedEmployees = z.object({
  service_id: z.number().optional(),
  employee_id: z.number().min(1),
  is_leader: z.boolean(),
  assigned_by: z.number().min(1),
});

export type CreateAssignedEmployees = z.infer<typeof CreateAssignedEmployees>;
export type UpdateAssignedEmployees = z.infer<typeof UpdateAssignedEmployees>;
