import { z } from 'zod';
export const UpdatePayrollReports = z.object({
  on_payroll_id: z.number().min(1),
  netpay: z.number().min(1),
  grosspay: z.number().min(1),
  total_deductions: z.number().min(1),
  total_benefits: z.number().min(1),
});

export type UpdatePayrollReports = z.infer<typeof UpdatePayrollReports>;
