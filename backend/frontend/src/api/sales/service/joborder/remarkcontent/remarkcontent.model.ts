import { z } from 'zod';

export const CreateRemarkContent = z.object({
  markdown: z.string().min(1),
});

export const UpdateRemarkContent = z.object({
  markdown: z.string().min(1),
});

export type CreateRemarkContent = z.infer<typeof CreateRemarkContent>;
export type UpdateRemarkContent = z.infer<typeof UpdateRemarkContent>;
