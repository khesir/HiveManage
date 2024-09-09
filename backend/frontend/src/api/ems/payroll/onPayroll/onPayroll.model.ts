import { z } from 'zod';

export const OnPayroll = z.object({
  employee_id: z.number().min(1),
  payroll_id: z.number().min(1),
});

export const OnPayrollArray = z.object({
  employees: z.array(OnPayroll),
});

export type OnPayroll = z.infer<typeof OnPayroll>;
export type OnPayrollArray = z.infer<typeof OnPayrollArray>;
