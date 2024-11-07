import { z } from 'zod';

export const CreateEmployeeRoles = z.object({
  employee_id: z.number().min(1),
  role_id: z.number().min(1),
  user_id: z.string().min(1),
});

export const UpdateEmployeeRoles = z.object({
  employee_id: z.number().min(1),
  role_id: z.number().min(1),
  user_id: z.string().min(1),
});

export type CreateEmployeeRoles = z.infer<typeof CreateEmployeeRoles>;
export type UpdateEmployeeRoles = z.infer<typeof UpdateEmployeeRoles>;
