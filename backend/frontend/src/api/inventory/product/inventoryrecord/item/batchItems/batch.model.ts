import { z } from 'zod';

export const CreateBatch = z.object({
  batch_item_id: z.number().optional(),
  item_id: z.number().min(1),
  batch_number: z.string().min(1),
  item_condition: z.enum([
    'New',
    'Old',
    'Damage',
    'Refurbished',
    'Used',
    'Antique',
    'Repaired',
  ]),
  item_status: z.enum(['Active', 'Reserve', 'Depleted']),
  quantity: z.number().min(1),
  reserved_quantity: z.number().optional(),
  unit_price: z.number().min(1),
  selling_price: z.number().min(1),
  production_date: z.string().optional(),
  expiration_date: z.string().optional(),
});

export type CreateBatch = z.infer<typeof CreateBatch>;
