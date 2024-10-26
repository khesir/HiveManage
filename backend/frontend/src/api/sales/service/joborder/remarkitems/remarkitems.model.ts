import { z } from 'zod';

export const CreateRemarkItems = z.object({
  sales_items_id: z.number().min(1),
  remark_id: z.number().min(1),
});

export const UpdateRemarkItems = z.object({
  sales_items_id: z.number().min(1),
  remark_id: z.number().min(1),
});

export type CreateRemarkItems = z.infer<typeof CreateRemarkItems>;
export type UpdateRemarkItems = z.infer<typeof UpdateRemarkItems>;
