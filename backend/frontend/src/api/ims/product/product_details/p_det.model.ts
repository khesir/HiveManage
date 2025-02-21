import { z } from 'zod';

export const CreateProductDetails = z.object({
  category_id: z.number().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  product_type: z.enum(['Batch', 'Serialized']),
  product_status: z.string().min(1),
  img_url: z.string().min(1),
  external_serial_code: z.string().min(1),
  warranty_date: z.date(),
});

export const UpdateProductDetails = z.object({
  category_id: z.number().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  product_type: z.enum(['Batch', 'Serialized']),
  product_status: z.string().min(1),
  img_url: z.string().min(1),
  external_serial_code: z.string().min(1),
  warranty_date: z.date(),
});

export type CreateProductDetails = z.infer<typeof CreateProductDetails>;
export type UpdateProductDetails = z.infer<typeof UpdateProductDetails>;
