import { z } from 'zod';

// Validation Schema
export const CreateOrder = z.object({
  product_id: z.number().min(1),
  items_ordered: z.number().min(1),
  expected_arrival: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  status: z.enum([
    'Pending',
    'Processing',
    'Delivered',
    'Cancelled',
    'Return',
    'Shipped',
  ]),
});
export const UpdateOrder = z.object({
  product_id: z.number().min(1),
  items_ordered: z.number().min(1),
  expected_arrival: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  status: z.enum([
    'Pending',
    'Processing',
    'Delivered',
    'Cancelled',
    'Return',
    'Shipped',
  ]),
});

export type CreateOrder = z.infer<typeof CreateOrder>;
export type UpdateOrder = z.infer<typeof UpdateOrder>;
