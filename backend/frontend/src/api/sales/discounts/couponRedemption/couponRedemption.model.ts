import { z } from 'zod';

export const CreateCouponRedemption = z.object({
  customer_id: z.number().min(1),
  discount_id: z.number().min(1),
});

export const UpdateCouponRedemption = z.object({
  customer_id: z.number().min(1),
  discount_id: z.number().min(1),
});

export type CreateCouponRedemption = z.infer<typeof CreateCouponRedemption>;
export type UpdateCouponRedemption = z.infer<typeof UpdateCouponRedemption>;
