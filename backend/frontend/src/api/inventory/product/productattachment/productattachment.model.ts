import { z } from 'zod';

export const CreateProductAttachment = z.object({
  arrive_Items_id: z.number().min(1),
  product_id: z.number().min(1),
  filepath: z.string().min(1),
});

export const UpdateProductAttachment = z.object({
  arrive_Items_id: z.number().min(1),
  product_id: z.number().min(1),
  filepath: z.string().min(1),
});

export type CreateProduct = z.infer<typeof CreateProductAttachment>;
export type UpdateProductAttachment = z.infer<typeof UpdateProductAttachment>;
