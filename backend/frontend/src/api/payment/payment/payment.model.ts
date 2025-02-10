import { z } from 'zod';

export const CreatePayment = z.object({
  service_id: z.number().min(1),
  service_type: z.enum(['Borrow', 'Reservation', 'Sales', 'Joborder']),
  amount: z.number().min(0),
  vat_rate: z.number().min(0),
  payment_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  payment_method: z.enum(['Cash', 'Card', 'Online Payment']),
  payment_status: z.enum([
    'Pending',
    'Completed',
    'Failed',
    'Cancelled',
    'Refunded',
    'Partially Refunded',
    'Overdue',
    'Processing',
    'Declined',
    'Authorized',
  ]),
});

export const UpdatePayment = z.object({
  service_id: z.number().min(1),
  service_type: z.enum(['Borrow', 'Reservation', 'Sales', 'Joborder']),
  amount: z.number().min(0),
  vat_rate: z.number().min(0),
  payment_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  payment_method: z.enum(['Cash', 'Card', 'Online Payment']),
  payment_status: z.enum([
    'Pending',
    'Completed',
    'Failed',
    'Cancelled',
    'Refunded',
    'Partially Refunded',
    'Overdue',
    'Processing',
    'Declined',
    'Authorized',
  ]),
});

export type CreatePayment = z.infer<typeof CreatePayment>;
export type UpdatePayment = z.infer<typeof UpdatePayment>;
