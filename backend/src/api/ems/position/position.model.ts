import { z } from 'zod';

export const CreatePosition = z.object({
  name: z.string().min(1),
});

export const UpdatePosition = z.object({
  name: z.string().min(1),
});

export type CreatePosition = z.infer<typeof CreatePosition>;
export type UpdatePosition = z.infer<typeof UpdatePosition>;
