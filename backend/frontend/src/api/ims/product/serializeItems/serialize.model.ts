import { z } from 'zod';

export const CreateSerialize = z.object({
  serial_id: z.number().optional(),
  product_id: z.number().min(1),
  supplier_id: z.number().min(1),
  serial_code: z.string().min(1),
  warranty_date: z.string().optional(),
  condition: z.enum(['New', 'Secondhand', 'Broken']),
  status: z.enum([
    'Sold',
    'Available',
    'In Service',
    'On Order',
    'Returned',
    'Damage',
    'Retired',
  ]),
});
export const UpdateSerialize = z.object({
  serial_id: z.number().optional(),
  product_id: z.number().optional(),
  supplier_id: z.number().optional(),
  serial_code: z.string().min(1),
  warranty_date: z.string().optional(),
  condition: z.enum(['New', 'Secondhand', 'Broken']),
  status: z.enum([
    'Sold',
    'Available',
    'In Service',
    'On Order',
    'Returned',
    'Damage',
    'Retired',
  ]),
});

export type UpdateSerialize = z.infer<typeof UpdateSerialize>;

export type CreateSerialize = z.infer<typeof CreateSerialize>;
