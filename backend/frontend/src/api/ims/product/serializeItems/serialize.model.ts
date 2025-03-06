import { z } from 'zod';

export const CreateSerialize = z.object({
  serial_id: z.number().optional(),
  product_id: z.number().min(1),
  supplier_id: z.number().min(1),
  serial_number: z.string().min(1),
  warranty_date: z.date().optional(),
  external_serial_code: z.string().optional(),
  external_warranty_date: z.string().optional(),
  price: z.number().min(1),
  condition: z.enum(['New', 'Secondhand', 'Broken']),
  status: z.enum([
    'Sold',
    'Pending Payment',
    'On Order',
    'In Service',
    'Awaiting Service',
    'Return Requested',
  ]),
});
export const UpdateSerialize = z.object({
  serial_id: z.number().optional(),
  product_id: z.number().optional(),
  supplier_id: z.number().optional(),
  serial_number: z.string().optional(),
  warranty_date: z.date().optional(),
  external_serial_code: z.string().optional(),
  external_warranty_date: z.date().optional(),
  price: z.number().min(1),
  condition: z.enum(['New', 'Secondhand', 'Broken']),
  status: z.enum([
    'Sold',
    'Pending Payment',
    'On Order',
    'In Service',
    'Awaiting Service',
    'Return Requested',
  ]),
});

export type UpdateSerialize = z.infer<typeof UpdateSerialize>;

export type CreateSerialize = z.infer<typeof CreateSerialize>;
