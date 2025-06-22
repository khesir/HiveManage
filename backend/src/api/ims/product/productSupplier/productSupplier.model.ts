import { z } from 'zod';

export const CreateProductSupplier = z.object({
  supplier_id: z.number(),
  product_id: z.number(),
  user: z.number().min(1),
});

export const UpdateProductSupplier = z.object({
  supplier_id: z.number(),
  product_id: z.number(),
  user: z.number().min(1),
});

export type CreateProductSupplier = z.infer<typeof CreateProductSupplier>;
export type UpdateProductSupplier = z.infer<typeof UpdateProductSupplier>;
