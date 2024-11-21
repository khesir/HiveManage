import { z } from 'zod';

export const CreateInventoryRecord = z.object({
  supplier_id: z.number().min(1),
  product_id: z.number().min(1),
  tag: z.string(),
  stock: z.number().min(1),
});

export const UpdateInventoryRecord = z.object({
  supplier_id: z.number().min(1),
  product_id: z.number().min(1),
  tag: z.enum([
    'New',
    'Old',
    'Damaged',
    'Refurbished',
    'Used',
    'Antique',
    'Repaired',
  ]),
  stock: z.number().min(1),
});

export type CreateInventoryRecord = z.infer<typeof CreateInventoryRecord>;
export type UpdateInventoryRecord = z.infer<typeof UpdateInventoryRecord>;
