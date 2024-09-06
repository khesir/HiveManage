import { z } from 'zod';

// Validation for the Payroll Schema
export const CreatePayroll = z.object({
  payroll_id: z.number().min(1),
  action: z.string().min(1),
});

export type CreatePayroll = z.infer<typeof CreatePayroll>;
