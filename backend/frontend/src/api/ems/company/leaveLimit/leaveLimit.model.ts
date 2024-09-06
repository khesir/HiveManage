import { z } from 'zod';

export const CreateLeaveLimit = z.object({
  employee_id: z.number().min(1),
  limit_count: z.number().multipleOf(0.01),
  leaveType: z.string().min(1),
});

export type CreateLeaveLimit = z.infer<typeof CreateLeaveLimit>;

export const UpdateLeaveLimit = z.object({
  employee_id: z.number().min(1).optional(),
  limit_count: z.number().multipleOf(0.01).optional(),
  leaveType: z.string().min(1).optional(),
});

export type UpdateLeaveLimit = z.infer<typeof UpdateLeaveLimit>;
