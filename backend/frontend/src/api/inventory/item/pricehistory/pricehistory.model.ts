import { z } from 'zod';

export const CreatePriceHistory = z.object({
  item_id: z.number().min(1),
  price: z.number().min(1),
  change_date: z.date(),
});

export const UpdatePriceHistory = z.object({
  item_id: z.number().min(1),
  price: z.number().min(1),
  change_date: z.date(),
});

export type CreatePriceHistory = z.infer<typeof CreatePriceHistory>;
export type UpdatePriceHistory = z.infer<typeof UpdatePriceHistory>;
