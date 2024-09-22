import { z } from 'zod';

export const CreateReserve = z.object({
  sales_id: z.number().min(1),
  service_id: z.number().min(1),
});

export const UpdateReserve = z.object({
  sales_id: z.number().min(1),
  service_id: z.number().min(1),
});

export type CreateReserve = z.infer<typeof CreateReserve>;
export type UpdateReserve = z.infer<typeof UpdateReserve>;
