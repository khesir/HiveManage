import { z } from 'zod';

export const CreateLeaveLimit = z.object({
  employee_id: z.number().min(1),
  limit_count: z.number().multipleOf(0.01),
  leaveType: z.enum(['Sick Leave', 'Vacation Leave', 'Personal Leave']),
});

export type CreateLeaveLimit = z.infer<typeof CreateLeaveLimit>;

export const UpdateLeaveLimit = z.object({
  employee_id: z.number().min(1).optional(),
  limit_count: z.number().multipleOf(0.01).optional(),
  leaveType: z.enum(['Sick Leave', 'Vacation Leave', 'Personal Leave']),
});

export type UpdateLeaveLimit = z.infer<typeof UpdateLeaveLimit>;
