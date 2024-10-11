import z from 'zod';

export const SalaryInformation = z.object({
  payroll_frequency: z.enum([
    'Daily',
    'Weekly',
    'Bi Weekly',
    'Semi Monthly',
    'Monthly',
  ]),
  base_salary: z.number().min(1),
});

export type SalaryInformation = z.infer<typeof SalaryInformation>;
