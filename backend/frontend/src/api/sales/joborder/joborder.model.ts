import { z } from 'zod';
const paymentSchema = z.object({
  payment_id: z.number().optional(),
  service_id: z.number().optional(),
  sales_id: z.number().optional(),
  amount: z.number().min(1, { message: 'Amount must be at least 1' }),
  vat_amount: z.number().optional(),
  discount_amount: z.number().optional(),
  paid_amount: z.number().min(1, { message: 'Paid amount must be at least 1' }),
  change_amount: z.number().optional(),
  payment_date: z.string().optional(),
  payment_method: z.enum(['Cash', 'Card', 'Online Payment'], {
    message: 'Invalid payment method',
  }),
  payment_type: z.enum(['Service', 'Sales'], {
    message: 'Invalid payment type',
  }),
  reference_number: z.string().optional(),
});

export const CreateJoborder = z.object({
  reservation_id: z.number().optional(),
  customer_id: z.number(),
  payment_id: z.number().optional(),
  expected_completion_date: z.string().optional(),
  completed_at: z.string().optional(),
  turned_over_at: z.string().optional(),
  status: z.enum([
    'Pending',
    'In Progress',
    'Completed',
    'Turned Over',
    'Cancelled',
  ]),
  user_id: z.number(),
  payment: paymentSchema.optional(),
});

export const UpdateJoborder = z.object({
  reservation_id: z.number().optional(),
  customer_id: z.number().optional(),
  payment_id: z.number().optional(),
  expected_completion_date: z.string().optional(),
  completed_at: z.string().optional(),
  turned_over_at: z.string().optional(),
  status: z.enum([
    'Pending',
    'In Progress',
    'Completed',
    'Turned Over',
    'Cancelled',
  ]),
  user_id: z.number(),
  payment: paymentSchema.optional(),
});

export type CreateJoborder = z.infer<typeof CreateJoborder>;
export type UpdateJoborder = z.infer<typeof UpdateJoborder>;
