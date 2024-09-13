import { z } from 'zod';

export const CreateAdditionalPay = z.object({
  employee_id: z.number().min(1),
  additional_pay_type: z.string().min(1),
  amount: z.number().min(1),
  description: z.string().min(1),
});

export type CreateAdditionalPay = z.infer<typeof CreateAdditionalPay>;
