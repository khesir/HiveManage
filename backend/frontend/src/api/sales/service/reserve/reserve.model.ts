import { z } from 'zod';

export const CreateReserve = z.object({
  customer_id: z.number().min(1),
  reserve_status: z.enum([
    'Pending',
    'Reserved',
    'Confirmed',
    'Cancelled',
    'Completed',
  ]),
});

export const UpdateReserve = z.object({
  customer_id: z.number().min(1),
  reserve_status: z.enum([
    'Pending',
    'Reserved',
    'Confirmed',
    'Cancelled',
    'Completed',
  ]),
});

export type CreateReserve = z.infer<typeof CreateReserve>;
export type UpdateReserve = z.infer<typeof UpdateReserve>;
