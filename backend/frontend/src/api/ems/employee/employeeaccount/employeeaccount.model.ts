import { z } from 'zod';

export const CreateEmployeeAccount = z.object({
  employee_id: z.number().min(1),
  account_name: z.string().min(1),
  password: z.string().min(1),
  salt: z.string().min(1),
});

export const UpdateEmployeeAccount = z.object({
  employee_id: z.number().min(1),
  account_name: z.string().min(1),
  password: z.string().min(1),
  salt: z.string().min(1),
});

export type CreateEmployeeAccount = z.infer<typeof CreateEmployeeAccount>;
export type UpdateEmployeeAccount = z.infer<typeof UpdateEmployeeAccount>;
