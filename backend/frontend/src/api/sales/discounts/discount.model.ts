import { z } from 'zod';

export const CreateDiscount = z.object({
  discount_name: z.string().min(1),
  discount_type: z.enum([
    'Percentage Discount',
    'Fixed Amount Discount',
    'BOGO (Buy x, Get y Free)',
    'Bulk Discount',
    'Seasonal Discount',
    'Clearance Sale',
    'Loyalty Discount',
    'First-Time Buyer Discount',
    'Referral Discount',
    'Employee Discount',
    'Cash Payment',
    'Coupon',
  ]),
  discount_value: z.number().min(1),
  coupon_code: z.string().min(1),
  is_single_use: z.boolean(),
  max_redemption: z.number().min(1),
  start_date: z.date(),
  end_date: z.date(),
  is_active: z.boolean(),
  min_purchase_amount: z.number().min(1),
  max_purchase_amount: z.number().min(1),
  usage_limit: z.number().min(1),
  times_used: z.number().min(1),
});

export const UpdateDiscount = z.object({
  discount_name: z.string().min(1),
  discount_type: z.enum([
    'Percentage Discount',
    'Fixed Amount Discount',
    'BOGO (Buy x, Get y Free)',
    'Bulk Discount',
    'Seasonal Discount',
    'Clearance Sale',
    'Loyalty Discount',
    'First-Time Buyer Discount',
    'Referral Discount',
    'Employee Discount',
    'Cash Payment',
    'Coupon',
  ]),
  discount_value: z.number().min(1),
  coupon_code: z.number().min(1),
  is_single_use: z.boolean(),
  max_redemption: z.number().min(1),
  start_date: z.date(),
  end_date: z.date(),
  is_active: z.boolean(),
  min_purchase_amount: z.string().min(1),
  max_purchase_amount: z.string().min(1),
  usage_limit: z.number().min(1),
  times_used: z.number().min(1),
});

export type CreateDiscount = z.infer<typeof CreateDiscount>;
export type UpdateDiscount = z.infer<typeof UpdateDiscount>;
