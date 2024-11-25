import { z } from 'zod';

export const CreateItem = z.object({
  item_record_id: z.number().min(1),
  serial_number: z.string().min(1),
  batch_number: z.string().min(1),
  item_type: z.enum(['Batch', 'Serialized']),
  item_condition: z.enum([
    'New',
    'Old',
    'Damage',
    'Refurbished',
    'Used',
    'Antique',
    'Repaired',
  ]),
  item_status: z.enum(['On Stock', 'Sold', 'Depleted']),
  quantity: z.number().min(1),
  unit_price: z.number().min(1),
  selling_price: z.number().min(1),
  warranty_expiry_date: z.string().optional(),
});

export const UpdateItem = z.object({
  item_record_id: z.number().min(1),
  serial_number: z.string().min(1),
  batch_number: z.string().min(1),
  item_type: z.enum(['Batch', 'Serialized']),
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
    // Sales-Related Statuses
    'On Stock',
    'Reserved',
    'Sold',
    'Returned',
    'Depleted',
    'Pending Payment',
    // Order-Related Statuses
    'On Order',
    'In Transit',
    'Returned',
    'Pending Inspection',
    // Service-Related Statuses
    'In Service',
    'Under Repair',
    'Awaiting Service',
    'Ready for Pickup',
    'Retired',
  ]),
  usage_type: z.enum(['Sales', 'Service', 'Both']).optional(),
  quantity: z.number().min(1),
  unit_price: z.number().min(1),
  selling_price: z.number().min(1),
  warranty_expiry_date: z.string(),
});

export type CreateItem = z.infer<typeof CreateItem>;
export type UpdateItem = z.infer<typeof UpdateItem>;
