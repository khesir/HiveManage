import { z } from 'zod';

export const CreateArriveItems = z.object({
  order_id: z.number().min(1),
  filePath: z.string().min(1),
});

export const UpdateArriveItems = z.object({
  order_id: z.number().min(1),
  filePath: z.string().min(1),
});

export type CreateArriveItems = z.infer<typeof CreateArriveItems>;
export type UpdateArriveItems = z.infer<typeof UpdateArriveItems>;
