import { z } from 'zod';

export const CreateProductVariantSupplier = z.object({
  variant_id: z.number().min(1),
  supplier_id: z.number().min(1),
  supply_price: z.number().min(1),
  minimum_order_quantity: z.number().min(1),
  lead_time_days: z.string().min(1),
});

export const UpdateProductVariantSupplier = z.object({
  variant_id: z.number().min(1),
  supplier_id: z.number().min(1),
  supply_price: z.number().min(1),
  minimum_order_quantity: z.number().min(1),
  lead_time_days: z.string().min(1),
});

export type CreateProductVariantSupplier = z.infer<
  typeof CreateProductVariantSupplier
>;
export type UpdateProductVariantSupplier = z.infer<
  typeof UpdateProductVariantSupplier
>;
