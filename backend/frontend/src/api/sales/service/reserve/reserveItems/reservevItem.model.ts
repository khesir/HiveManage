import { z } from 'zod';

export const CreateReserveItem = z.object({
  reserve_id: z.number().min(1),
  product_id: z.number().min(1),
  status: z.enum([
    'Pending',
    'Reserved',
    'Confirmed',
    'Cancelled',
    'Completed',
  ]),
});

export const UpdateReserveItem = z.object({
  reserve_id: z.number().min(1),
  product_id: z.number().min(1),
  status: z.enum([
    'Pending',
    'Reserved',
    'Confirmed',
    'Cancelled',
    'Completed',
  ]),
});

export type CreateReserveItem = z.infer<typeof CreateReserveItem>;
export type UpdateReserveItem = z.infer<typeof UpdateReserveItem>;
