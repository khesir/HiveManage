import { z } from 'zod';

export const CreateSales = z.object({
  employee_id: z.number().min(1),
  customer_id: z.number().min(1),
  total_amount: z.number().min(1),
});

export const UpdateSales = z.object({
  employee_id: z.number().min(1),
  customer_id: z.number().min(1),
  total_amount: z.number().min(1),
});

export type CreateSales = z.infer<typeof CreateSales>;
export type UpdateSales = z.infer<typeof UpdateSales>;
