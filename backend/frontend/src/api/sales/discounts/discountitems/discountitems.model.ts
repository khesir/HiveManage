import { z } from 'zod';

export const CreateDiscountItems = z.object({
  product_id: z.number().min(1),
  discount_id: z.number().min(1),
  category_id: z.number().min(1),
});

export const UpdateDiscountItems = z.object({
  product_id: z.number().min(1),
  discount_id: z.number().min(1),
  category_id: z.number().min(1),
});

export type CreateDiscountItems = z.infer<typeof CreateDiscountItems>;
export type UpdateDiscountItems = z.infer<typeof UpdateDiscountItems>;
