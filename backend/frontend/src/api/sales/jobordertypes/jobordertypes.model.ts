import { z } from 'zod';

export const CreateJobOrderTypes = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  joborder_types_status: z.enum(['Available', 'Not Available']),
});

export const UpdateJobOrderTypes = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  joborder_types_status: z.enum(['Available', 'Not Available']),
});

export type CreateJobOrderTypes = z.infer<typeof CreateJobOrderTypes>;
export type UpdateJobOrderTypes = z.infer<typeof UpdateJobOrderTypes>;
