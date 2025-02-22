import { z } from 'zod';

export const CreateJobOrder = z.object({
  joborder_type_id: z.number().min(1),
  customer_id: z.number().optional(),
  uuid: z.string().min(1),
  fee: z.number().min(1),
  description: z.string().min(1),
  joborder_status: z.enum([
    'Pending',
    'In Progress',
    'Completed',
    'On Hold',
    'Cancelled',
    'Awaiting Approval',
    'Approved',
    'Rejected',
    'Closed',
  ]),
  total_price_cost: z.number().optional(),
});

export const UpdateJobOrder = z.object({
  joborder_type_id: z.number().min(1),
  customer_id: z.number().optional(),
  uuid: z.string().min(1),
  fee: z.number().min(1),
  description: z.string().min(1),
  joborder_status: z.enum([
    'Pending',
    'In Progress',
    'Completed',
    'On Hold',
    'Cancelled',
    'Awaiting Approval',
    'Approved',
    'Rejected',
    'Closed',
  ]),
  total_price_cost: z.number().optional(),
});

export type CreateJobOrder = z.infer<typeof CreateJobOrder>;
export type UpdateJobOrder = z.infer<typeof UpdateJobOrder>;
