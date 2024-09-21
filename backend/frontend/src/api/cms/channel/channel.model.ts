import { z } from 'zod';

export const CreateChannel = z.object({
  inquiry_id: z.number().min(1),
  channel_name: z.string().min(1),
  is_private: z.string().min(1),
});

export const UpdateChannel = z.object({
  inquiry_id: z.number().min(1),
  channel_name: z.string().min(1),
  is_private: z.string().min(1),
});

export type CreateChannel = z.infer<typeof CreateChannel>;
export type UpdateChannel = z.infer<typeof UpdateChannel>;
