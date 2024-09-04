import { z } from 'zod';

export const CreateDesignation = z.object({
  title: z.string().min(1),
  status: z.string().min(1),
});

export type CreateDesignation = z.infer<typeof CreateDesignation>;

export const UpdateDesignation = z.object({
  title: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
});

export type UpdateDesignation = z.infer<typeof UpdateDesignation>;
