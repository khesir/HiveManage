import { z } from 'zod';

export const CreateJobOrder = z.object({
  joborder_type_id: z.number().min(1),
  service_id: z.number().min(1),
  uuid: z.number().min(1),
  fee: z.number().min(1),
  status: z.enum([
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
});

export const UpdateJobOrder = z.object({
  joborder_type_id: z.number().min(1),
  service_id: z.number().min(1),
  uuid: z.number().min(1),
  fee: z.number().min(1),
  status: z.enum([
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
});

export type CreateJobOrder = z.infer<typeof CreateJobOrder>;
export type UpdateJobOrder = z.infer<typeof UpdateJobOrder>;
