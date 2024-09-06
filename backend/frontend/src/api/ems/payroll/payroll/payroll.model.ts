import { z } from 'zod';

// Validation for the Payroll Schema
export const CreatePayroll = z.object({
  start: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  end: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  pay_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  payroll_finished: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  approvalStatus: z.string(),
});

export type CreatePayroll = z.infer<typeof CreatePayroll>;
