import { z } from 'zod';

export const CreateServiceType = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export const UpdateServiceType = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export type CreateServiceType = z.infer<typeof CreateServiceType>;
export type UpdateServiceType = z.infer<typeof UpdateServiceType>;
