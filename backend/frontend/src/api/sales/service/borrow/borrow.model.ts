import { z } from 'zod';

export const CreateBorrow = z.object({
  borrow_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  return_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  fee: z.number().min(1),
  customer_id: z.number().min(1),
  status: z.enum([
    'Borrowed',
    'Confirmed',
    'Cancelled',
    'Pending',
    'Completed',
  ]),
});

export const UpdateBorrow = z.object({
  borrow_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  return_data: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  fee: z.number().min(1),
  customer_id: z.number().min(1),
  status: z.enum([
    'Borrowed',
    'Confirmed',
    'Cancelled',
    'Pending',
    'Completed',
  ]),
});

export type CreateBorrow = z.infer<typeof CreateBorrow>;
export type UpdateBorrow = z.infer<typeof UpdateBorrow>;
