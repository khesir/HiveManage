import { z } from 'zod';

export const CreateRemarkType = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export const UpdateRemarkType = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export type CreateRemarkType = z.infer<typeof CreateRemarkType>;
export type UpdateRemarkType = z.infer<typeof UpdateRemarkType>;
