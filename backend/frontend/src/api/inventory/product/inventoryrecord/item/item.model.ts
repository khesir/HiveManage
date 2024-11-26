import { z } from 'zod';

export const CreateItem = z.object({
  item_record_id: z.number().min(1),
  item_type: z.enum(['Batch', 'Serialized', 'Both']),
  item_condition: z.enum([
    'New',
    'Old',
    'Damage',
    'Refurbished',
    'Used',
    'Antique',
    'Repaired',
  ]),
  item_status: z.enum([
    'OnStock',
    'Sold',
    'Depleted',
    'Returned',
    'Pending Payment',
    'On Order',
    'In Transit',
    'Return Requested',
    'Pending Inspection',
    'In Service',
    'Under Repair',
    'Awaiting Service',
    'Ready for Pickup',
    'Retired',
  ]),
  quantity: z.number().min(1),
  reorder_level: z.number().optional(),
});

export const UpdateItem = z.object({
  item_record_id: z.number().min(1),
  item_type: z.enum(['Batch', 'Serialized', 'Both']),
  item_status: z.enum([
    'OnStock',
    'Sold',
    'Depleted',
    'Returned',
    'Pending Payment',
    'On Order',
    'In Transit',
    'Return Requested',
    'Pending Inspection',
    'In Service',
    'Under Repair',
    'Awaiting Service',
    'Ready for Pickup',
    'Retired',
  ]),
  quantity: z.number().min(1),
  reorder_level: z.number().optional(),
});

export type CreateItem = z.infer<typeof CreateItem>;
export type UpdateItem = z.infer<typeof UpdateItem>;
