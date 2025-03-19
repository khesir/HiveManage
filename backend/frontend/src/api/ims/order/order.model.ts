import { z } from 'zod';

const orderStatusEnum = z.enum([
  'Waiting for Arrival',
  'Pending',
  'Delivered',
  'Returned',
  'Pending Payment',
  'Cancelled',
]);
const orderPaymentStatus = z.enum(['Pending', 'Partially Paid', 'Paid']);
const orderPaymentMethod = z.enum([
  'Cash',
  'Credit Card',
  'Bank Transfer',
  'Check',
  'Digital Wallet',
]);

const orderItem = z.object({
  product_id: z.number().min(1),
  quantity: z.number().min(1),
  price: z.string().min(1),
});

export const CreateOrder = z.object({
  supplier_id: z.number(),

  notes: z.string().optional(),
  receive_at: z.date().optional(),
  expected_arrival: z.string().optional(),

  ordered_value: z.number(),
  order_status: orderStatusEnum,
  order_payment_status: orderPaymentStatus.optional(),
  order_payment_method: orderPaymentMethod.optional(),

  order_items: z.array(orderItem).optional(),
});

export const UpdateOrder = z.object({
  notes: z.string().optional(),
  receive_at: z.date().optional(),
  expected_arrival: z.string().optional(),

  ordered_value: z.number(),
  order_status: orderStatusEnum,
  order_payment_status: orderPaymentStatus.optional(),
  order_payment_method: orderPaymentMethod.optional(),
});

export type CreateOrder = z.infer<typeof CreateOrder>;
export type UpdateOrder = z.infer<typeof UpdateOrder>;
