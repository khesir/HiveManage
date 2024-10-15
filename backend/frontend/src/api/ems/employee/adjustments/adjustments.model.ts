import { z } from 'zod';

export const CreateAdjustments = z.object({
  employee_id: z.number().min(1),
  name: z.string().min(1),
  remarks: z.string().min(1),
  adjustment_type: z.string().min(1),
  amount: z.number().min(1),
  description: z.string().min(1),
});

export const UpdateAdjustments = z.object({
  name: z.string().min(1),
  remarks: z.string().min(1),
  adjustment_type: z.string().min(1),
  amount: z.number().min(1),
  description: z.string().min(1),
});

export type CreateAdjustments = z.infer<typeof CreateAdjustments>;
export type UpdateAdjustments = z.infer<typeof UpdateAdjustments>;
