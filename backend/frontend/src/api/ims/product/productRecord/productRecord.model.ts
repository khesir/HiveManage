import { z } from 'zod';

export const CreateProductRecord = z.object({
  product_id: z.number().optional(),
  record_name: z.string().min(1),
  quantity: z.number().min(1),
  record_type: z.enum(['Firsthand', 'Secondhand', 'Broken']),
  status: z.string().min(1),
});

export const UpdateProductRecord = z.object({
  product_id: z.number().optional(),
  record_name: z.string().min(1),
  quantity: z.number().min(1),
  record_type: z.enum(['Firsthand', 'Secondhand', 'Broken']),
  status: z.string().min(1),
});

export type CreateProductRecord = z.infer<typeof CreateProductRecord>;
export type UpdateProductRecord = z.infer<typeof UpdateProductRecord>;
