import z from 'zod';

export const LeaveRequest = z.object({
  employee_id: z.number().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  date_of_leave: z.string().min(1),
  date_of_return: z.string().min(1),
  status: z.string().min(1),
  comment: z.string().min(1).optional(),
  leaveType: z.enum(['Sick Leave', 'Vacation Leave', 'Personal Leave']),
});

export type LeaveRequest = z.infer<typeof LeaveRequest>;

export const UpdateLeave = z.object({
  employee_id: z.number().min(1).optional(),
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  date_of_leave: z.string().min(1),
  date_of_return: z.string().min(1),
  status: z.string().min(1).optional(),
  comment: z.string().min(1).optional(),
  leaveType: z.enum(['Sick Leave', 'Vacation Leave', 'Personal Leave']),
});

export type UpdateLeave = z.infer<typeof UpdateLeave>;
