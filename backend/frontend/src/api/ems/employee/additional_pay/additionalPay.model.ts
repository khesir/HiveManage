import { z } from 'zod';

export const CreateAdditionalPay = z.object({
  employee_id: z.number().optional(),
  name: z.string().min(1),
  additional_pay_type: z.string().min(1),
  amount: z.number().min(1),
  description: z.string().min(1),
});

export const UpdateAdditionalPay = z.object({
  name: z.string().min(1),
  additional_pay_type: z.string().min(1),
  amount: z.number().min(1),
  description: z.string().min(1),
});

export type CreateAdditionalPay = z.infer<typeof CreateAdditionalPay>;
export type UpdateAdditionalPay = z.infer<typeof UpdateAdditionalPay>;
