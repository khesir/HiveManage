import { z } from 'zod';

export const CreateReceipt = z.object({
  sales_id: z.number().min(1),
  payment_id: z.number().min(1),
  issued_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  total_amount: z.number().min(1),
});

export const UpdateReceipt = z.object({
  sales_id: z.number().min(1),
  payment_id: z.number().min(1),
  issued_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  total_amount: z.number().min(1),
});

export type CreateReceipt = z.infer<typeof CreateReceipt>;
export type UpdateReceipt = z.infer<typeof UpdateReceipt>;
