import { z } from 'zod';

export const CreateRemarkTickets = z.object({
  job_order_id: z.number().min(1),
  remark_type: z.enum([
    'General',
    'Urgent',
    'Follow-up',
    'Resolved',
    'On-Hold',
    'Information',
  ]),
  created_by: z.number().min(1),
});

export const UpdateRemarkTickets = z.object({
  job_order_id: z.number().min(1),
  remark_type: z.enum([
    'General',
    'Urgent',
    'Follow-up',
    'Resolved',
    'On-Hold',
    'Information',
  ]),
  created_by: z.number().min(1),
});

export type CreateRemarkTickets = z.infer<typeof CreateRemarkTickets>;
export type UpdateRemarkTickets = z.infer<typeof UpdateRemarkTickets>;
