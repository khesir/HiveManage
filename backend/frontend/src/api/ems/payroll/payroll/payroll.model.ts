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
  approvalStatus: z.string().min(1),
});

export const UpdatePayroll = z.object({
  payroll_id: z.number().min(1),
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
  approvalStatus: z.string().min(1),
});

export type CreatePayroll = z.infer<typeof CreatePayroll>;
export type UpdatePayroll = z.infer<typeof UpdatePayroll>;
