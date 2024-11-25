import { z } from 'zod';

const createItem = z.object({
  item_record_id: z.number().optional(),
  serial_number: z.string().optional(),
  batch_number: z.string().optional(),
  item_number: z.string().min(1),
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

export const CreateItemRecord = z.object({
  product_id: z.number().optional(),
  supplier_id: z.number().min(1),
  total_stock: z.number().min(1),
  item: z.array(createItem).optional(),
});

export const UpdateItemRecord = z.object({
  supplier_id: z.number().min(1),
  product_id: z.number().min(1),
  total_stock: z.number().min(1),
});

export type CreateItemRecord = z.infer<typeof CreateItemRecord>;
export type UpdateItemRecord = z.infer<typeof UpdateItemRecord>;
