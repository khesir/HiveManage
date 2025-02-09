import { z } from 'zod';

const batchItem = z.object({
  batch_item_id: z.number().optional(),
  item_id: z.number().optional(),
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

const serializeItem = z.object({
  serialized_item_id: z.number().optional(),
  item_id: z.number().optional(),
  serial_number: z.string().min(1),
  item_condition: z.enum([
    'New',
    'Old',
    'Damage',
    'Refurbished',
    'Used',
    'Antique',
    'Repaired',
  ]),
  item_status: z.enum(['Active', 'Sold', 'Decommisioned']),
  unit_price: z.number().min(1),
  selling_price: z.number().min(1),
  warranty_expiry_date: z.string().optional(),
});

const createItem = z.object({
  item_record_id: z.number().optional(),
  variant_id: z.number().min(1),
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
  batch_items: z.array(batchItem).optional(),
  serialize_items: z.array(serializeItem).optional(),
});

export const CreateItemRecord = z.object({
  product_id: z.number().optional(),
  supplier_id: z.number().min(1),
  total_stock: z.number().min(1),
  item: createItem.optional(),
});

export const UpdateItemRecord = z.object({
  supplier_id: z.number().min(1),
  product_id: z.number().min(1),
  total_stock: z.number().min(1),
});

export type CreateItemRecord = z.infer<typeof CreateItemRecord>;
export type UpdateItemRecord = z.infer<typeof UpdateItemRecord>;
