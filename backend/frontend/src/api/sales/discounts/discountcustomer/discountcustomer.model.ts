import { z } from 'zod';

export const CreateDiscountCustomer = z.object({
  customer_id: z.number().min(1),
  customer_group_id: z.number().min(1),
  discount_id: z.number().min(1),
});

export const UpdateDiscountCustomer = z.object({
  customer_id: z.number().min(1),
  customer_group_id: z.number().min(1),
  discount_id: z.number().min(1),
});

export type CreateDiscountCustomer = z.infer<typeof CreateDiscountCustomer>;
export type UpdateDiscountCustomer = z.infer<typeof UpdateDiscountCustomer>;
