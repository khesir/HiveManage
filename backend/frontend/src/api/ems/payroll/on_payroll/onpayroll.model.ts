import { z } from 'zod';

export const CreateOnPayroll = z.object({
  employee_id: z.number().min(1),
  payroll_id: z.number().min(1),
});

export type CreateOnPayroll = z.infer<typeof CreateOnPayroll>;
