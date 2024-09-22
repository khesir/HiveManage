import { z } from 'zod';

export const CreateMessage = z.object({
  inquiry_id: z.number().min(1),
  sender_id: z.number().min(1),
  sender_type: z.string().min(1),
  content: z.string().min(1),
});

export const UpdateMessage = z.object({
  inquiry_id: z.number().min(1),
  sender_id: z.number().min(1),
  sender_type: z.string().min(1),
  content: z.string().min(1),
});

export type CreateMessage = z.infer<typeof CreateMessage>;
export type UpdateMessage = z.infer<typeof UpdateMessage>;
