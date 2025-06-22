import { z } from 'zod';

export const CreatePayment = z.object({
  service_id: z.number().min(1),
  sales_id: z.number().min(1),
  service_type: z.enum(['Borrow', 'Reservation', 'Sales', 'Joborder']),
  amount: z.number(),
  paid_amount: z.number(),
  change_amount: z.number(),
  vat_amount: z.number(),
  discount_amount: z.number(),
  payment_date: z.string(),
  payment_method: z.enum(['Cash', 'Card', 'Online Payment']),
  payment_type: z.enum(['Service', 'Sales']),

  reference_number: z.string(),
});

export const UpdatePayment = z.object({
  service_id: z.number().min(1),
  sales_id: z.number().min(1),
  service_type: z.enum(['Borrow', 'Reservation', 'Sales', 'Joborder']),
  amount: z.number(),
  paid_amount: z.number(),
  change_amount: z.number(),
  vat_amount: z.number(),
  discount_amount: z.number(),
  payment_date: z.string(),
  payment_method: z.enum(['Cash', 'Card', 'Online Payment']),
  payment_type: z.enum(['Service', 'Sales']),

  reference_number: z.string(),
});

export type CreatePayment = z.infer<typeof CreatePayment>;
export type UpdatePayment = z.infer<typeof UpdatePayment>;
