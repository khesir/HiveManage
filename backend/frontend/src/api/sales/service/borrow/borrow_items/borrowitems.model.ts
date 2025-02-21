import { z } from 'zod';

export const CreateBorrowItem = z.object({
  borrow_id: z.number().min(1),
  product_id: z.number().min(1),
  borrow_date: z.string().min(1),
  fee: z.number().min(1),
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
  return_date: z.string().min(1),
});

export const UpdateBorrowItem = z.object({
  borrow_id: z.number().min(1),
  product_id: z.number().min(1),
  borrow_date: z.string().min(1),
  fee: z.number().min(1),
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
  return_date: z.string().min(1),
});

export type CreateBorrowItem = z.infer<typeof CreateBorrowItem>;
export type UpdateBorrowItem = z.infer<typeof UpdateBorrowItem>;
