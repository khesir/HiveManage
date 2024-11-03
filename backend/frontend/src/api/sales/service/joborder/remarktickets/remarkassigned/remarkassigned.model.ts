import { z } from 'zod';

export const CreateRemarkAssigned = z.object({
  remark_id: z.number().min(1),
  employee_id: z.number().optional(),
});

export const UpdateRemarkAssigned = z.object({
  remark_id: z.number().min(1),
  employee_id: z.number().optional(),
});

export type CreateRemarkAssigned = z.infer<typeof CreateRemarkAssigned>;
export type UpdateRemarkAssigned = z.infer<typeof UpdateRemarkAssigned>;
