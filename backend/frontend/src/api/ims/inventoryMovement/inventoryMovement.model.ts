import { z } from 'zod';

export const CreateInventoryMovement = z.object({
  product_id: z.number().min(1),
  source_type: z.enum(['Supplier', 'Stock', 'Service', 'Damage']),
  destination_type: z.enum(['Stock', 'Service', 'Damage']),
  quantity: z.number().min(1),
  serial_ids: z.string().optional(),
  reason: z.string().min(1),
});
export const UpdateInventoryMovement = z.object({
  product_id: z.number().min(1),
  source_type: z.enum(['Supplier', 'Stock', 'Service', 'Damage']),
  destination_type: z.enum(['Stock', 'Service', 'Damage']),
  quantity: z.number().min(1),
  serial_ids: z.string().optional(),
  reason: z.string().min(1),
});

export type CreateInventoryMovement = z.infer<typeof CreateInventoryMovement>;

export type UpdateInventoryMovement = z.infer<typeof UpdateInventoryMovement>;
