import { z } from 'zod';

export const CreateSales = z.object({
  customer_id: z.number().min(1),
  status: z.enum(['Completed', 'Partially Completed', 'Cancelled']),
});

export const UpdateSales = z.object({
  customer_id: z.number().min(1),
  status: z.enum(['Completed', 'Partially Completed', 'Cancelled']),
});

export type CreateSales = z.infer<typeof CreateSales>;
export type UpdateSales = z.infer<typeof UpdateSales>;
