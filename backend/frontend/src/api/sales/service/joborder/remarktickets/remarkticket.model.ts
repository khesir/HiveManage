import { z } from 'zod';

export const CreateRemarkTickets = z.object({
  job_order_id: z.number().min(1),
  created_by: z.number().min(1),
  remark_type: z.enum([
    'General',
    'Urgent',
    'Follow-up',
    'Resolved',
    'On-Hold',
    'Information',
  ]),
  description: z.string().min(1),
  remarktickets_status: z.enum([
    'Resolved',
    'Pending',
    'In Progress',
    'Rejected',
    'Closed',
    'Open',
  ]), // Updated to match expected values
});

export const UpdateRemarkTickets = z.object({
  job_order_id: z.number().min(1),
  created_by: z.number().min(1),
  remark_type: z.enum([
    'General',
    'Urgent',
    'Follow-up',
    'Resolved',
    'On-Hold',
    'Information',
  ]),
  description: z.string().min(1),
  remarktickets_status: z.enum([
    'General',
    'Urgent',
    'Follow-up', // Updated to match the seed data
    'Resolved',
    'On-Hold',
    'Information',
  ]),
});

export type CreateRemarkTickets = z.infer<typeof CreateRemarkTickets>;
export type UpdateRemarkTickets = z.infer<typeof UpdateRemarkTickets>;
