import { z } from 'zod';

export const CreateProductVariant = z.object({
  product_id: z.number().min(1),
  img_url: z.string().min(1),
  variant_name: z.string().min(1),
  attribute: z.string().min(1),
});

export const UpdateProductVariant = z.object({
  product_id: z.number().min(1),
  img_url: z.string().min(1),
  variant_name: z.string().min(1),
  attribute: z.string().min(1),
});

export type CreateProductVariant = z.infer<typeof CreateProductVariant>;
export type UpdateProductVariant = z.infer<typeof UpdateProductVariant>;
