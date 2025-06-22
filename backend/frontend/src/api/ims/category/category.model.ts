import { z } from 'zod';

export const CreateCategory = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
});

export const UpdateCategory = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
});

export type CreateCategory = z.infer<typeof CreateCategory>;
export type UpdateCategory = z.infer<typeof UpdateCategory>;
