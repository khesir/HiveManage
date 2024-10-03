import z from 'zod';

export const EmploymentInformation = z.object({
  employee_id: z.number().min(1),
  department_id: z.number().min(1),
  designation_id: z.number().min(1),
  employee_type: z.enum([
    'Regular',
    'Probationary',
    'Contractual',
    'Seasonal',
    'Temporary',
  ]),
  employee_status: z.enum([
    'Active',
    'OnLeave',
    'Terminated',
    'Resigned',
    'Suspended',
    'Retired',
    'Inactive',
  ]),
});

export type EmploymentInformation = z.infer<typeof EmploymentInformation>;
