import { z } from 'zod';

export const CreateBorrow = z.object({
  sales_id: z.number().min(1),
  service_id: z.number().min(1),
  sales_items_id: z.number().min(1),
  borrow_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  return_data: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  fee: z.number().min(1),
  tag_item: z.enum(['New', 'Used', 'Broken']),
  status: z.enum([
    'Requested',
    'Approved',
    'Borrowed',
    'Returned',
    'Overdue',
    'Rejected',
    'Cancelled',
    'Lost',
    'Damaged',
  ]),
});

export const UpdateBorrow = z.object({
  sales_id: z.number().min(1),
  service_id: z.number().min(1),
  sales_items_id: z.number().min(1),
  borrow_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  return_data: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  fee: z.number().min(1),
  tag_item: z.enum(['New', 'Used', 'Broken']),
  status: z.enum([
    'Requested',
    'Approved',
    'Borrowed',
    'Returned',
    'Overdue',
    'Rejected',
    'Cancelled',
    'Lost',
    'Damaged',
  ]),
});

export type CreateBorrow = z.infer<typeof CreateBorrow>;
export type UpdateBorrow = z.infer<typeof UpdateBorrow>;
