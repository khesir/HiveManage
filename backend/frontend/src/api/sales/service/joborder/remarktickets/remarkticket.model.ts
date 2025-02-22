import { z } from 'zod';

export const CreateRemarkTickets = z.object({
  remark_type_id: z.number().min(1),
  job_order_id: z.number().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().optional(),
  remarktickets_status: z.enum(['Resolved', 'Pending', 'Removed']),
  deadline: z.string().optional(),
});

export const UpdateRemarkTickets = z.object({
  remark_type_id: z.number().min(1),
  job_order_id: z.number().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().optional(),
  remarktickets_status: z.enum(['Resolved', 'Pending', 'Removed']),
  deadline: z.string().optional(),
});

export type CreateRemarkTickets = z.infer<typeof CreateRemarkTickets>;
export type UpdateRemarkTickets = z.infer<typeof UpdateRemarkTickets>;
