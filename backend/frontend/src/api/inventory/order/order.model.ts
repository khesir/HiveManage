import { z } from 'zod';

// Validation Schema
export const CreateOrder = z.object({
  product_id: z.number().min(1),
  items_ordered: z.number().min(1),
  expected_arrival: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  status: z.string().min(1),
});
export const UpdateOrder = z.object({
  product_id: z.number().min(1),
  items_ordered: z.number().min(1),
  expected_arrival: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  status: z.string().min(1),
});

export type CreateOrder = z.infer<typeof CreateOrder>;
export type UpdateOrder = z.infer<typeof UpdateOrder>;
