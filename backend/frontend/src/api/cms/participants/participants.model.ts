import { z } from 'zod';

export const CreateParticipants = z.object({
  employee_id: z.number().min(1),
  channel_id: z.number().min(1),
  is_private: z.string().min(1),
});

export const UpdateParticipants = z.object({
  employee_id: z.number().min(1),
  channel_id: z.number().min(1),
  is_private: z.string().min(1),
});

export type CreateParticipants = z.infer<typeof CreateParticipants>;
export type UpdateParticipants = z.infer<typeof UpdateParticipants>;
