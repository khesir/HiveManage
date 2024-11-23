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
  unit_price: z
    .number()
    .min(1)
    .transform((value) => value.toFixed(2)), // Convert to string
  selling_price: z
    .number()
    .min(1)
    .transform((value) => value.toFixed(2)), // Convert to string
  warranty_expiry_date: z.date().transform((value) => value.toISOString()), // Convert Date to ISO string
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
  item_status: z.enum(['On Stock', 'Sold', 'Depleted']),
  unit_price: z
    .number()
    .min(1)
    .transform((value) => value.toFixed(2)), // Convert to string
  selling_price: z
    .number()
    .min(1)
    .transform((value) => value.toFixed(2)), // Convert to string
  warranty_expiry_date: z.date().transform((value) => value.toISOString()), // Convert Date to ISO string
});

export type CreateItem = z.infer<typeof CreateItem>;
export type UpdateItem = z.infer<typeof UpdateItem>;
