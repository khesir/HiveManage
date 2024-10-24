import { z } from 'zod';

export const CreateReserve = z.object({
  service_id: z.number().min(1),
  sales_item_id: z.number().min(1),
  reserve_status: z.enum([
    'Pending',
    'Reserved',
    'Confirmed',
    'Cancelled',
    'Completed',
  ]), // Enum matching the expected values
});

export const UpdateReserve = z.object({
  service_id: z.number().min(1),
  sales_item_id: z.number().min(1),
  reserve_status: z.enum([
    'Pending',
    'Reserved',
    'Confirmed',
    'Cancelled',
    'Completed',
  ]), // Enum matching the expected values
});

export type CreateReserve = z.infer<typeof CreateReserve>;
export type UpdateReserve = z.infer<typeof UpdateReserve>;
