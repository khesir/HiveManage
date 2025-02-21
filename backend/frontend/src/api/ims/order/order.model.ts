import { z } from 'zod';

const orderStatusEnum = z.enum([
  'Waiting for Arrival',
  'Pending',
  'Delivered',
  'Returned',
  'Pending Payment',
  'Cancelled',
]);
const orderItemEnum = z.enum([
  'Pending',
  'Partially Delivered',
  'Delivered',
  'Damaged',
  'Returned',
  'Cancelled',
]);

export const CreateOrder = z.object({
  supplier_id: z.number(),
  ordered_value: z.number(),
  expected_arrival: z.string().optional(),
  status: orderStatusEnum,
  created_at: z.date().optional(),
  last_updated: z.date().optional(),
  deleted_at: z.date().nullable().optional(),
  order_items: z
    .array(
      z.object({
        variant_id: z.number().min(1),
        product_id: z.number().min(1),
        item_type: z.string().min(1),
        quantity: z.string().min(1),
        price: z.string().min(1),
        status: orderItemEnum,
      }),
    )
    .optional(),
});

export const UpdateOrder = z.object({
  item_id: z.number().min(1),
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
