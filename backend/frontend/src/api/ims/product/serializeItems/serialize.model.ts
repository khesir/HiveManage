import { z } from 'zod';

export const CreateSerialize = z.object({
  serialized_item_id: z.number().optional(),
  product_id: z.number().min(1),
  serial_number: z.string().min(1),
  status: z.enum([
    'Available',
    'Sold',
    'Decommissioned',
    'Reserved',
    'Pending',
    'Returned',
  ]),
});

export type CreateSerialize = z.infer<typeof CreateSerialize>;
