import z from 'zod';

export const SalaryInformation = z.object({
  employee_id: z.number().min(1),
  payroll_frequency: z.string().min(1),
  base_salary: z.number().min(1),
});

export type SalaryInformation = z.infer<typeof SalaryInformation>;
