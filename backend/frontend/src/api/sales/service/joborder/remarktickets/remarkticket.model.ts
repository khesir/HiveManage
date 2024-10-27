import { z } from 'zod';

export const CreateRemarkTickets = z.object({
  remark_type_id: z.number().min(1),
  job_order_id: z.number().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  remarktickets_status: z.enum([
    'Resolved',
    'Pending',
    'In Progress',
    'Rejected',
    'Closed',
    'Open',
  ]), // Updated to match expected values
  created_by: z.number().min(1),
  deadline: z.date(),
});

export const UpdateRemarkTickets = z.object({
  remark_type_id: z.number().min(1),
  job_order_id: z.number().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  remarktickets_status: z.enum([
    'Resolved',
    'Pending',
    'In Progress',
    'Rejected',
    'Closed',
    'Open',
  ]), // Updated to match expected values
  created_by: z.number().min(1),
  deadline: z.date(),
});

export type CreateRemarkTickets = z.infer<typeof CreateRemarkTickets>;
export type UpdateRemarkTickets = z.infer<typeof UpdateRemarkTickets>;
