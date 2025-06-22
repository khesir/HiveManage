import z from 'zod';

export const EmploymentInformation = z.object({
  employee_id: z.number().optional(),
  department_id: z.number().min(1),
  designation_id: z.number().min(1),
  employee_type: z.string().min(1),
  employee_status: z.string().min(1),
});

export type EmploymentInformation = z.infer<typeof EmploymentInformation>;
