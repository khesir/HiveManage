import { z } from 'zod';

export const CreatePayment = z.object({
  sales_id: z.number().min(1),
  amount: z.number().min(1),
  payment_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  payment_method: z.string().min(1),
  payment_status: z.string().min(1),
});

export const UpdatePayment = z.object({
  sales_id: z.number().min(1),
  amount: z.number().min(1),
  payment_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  payment_method: z.string().min(1),
  payment_status: z.string().min(1),
});

export type CreatePayment = z.infer<typeof CreatePayment>;
export type UpdatePayment = z.infer<typeof UpdatePayment>;
