import { z } from 'zod';

export const CreateReports = z.object({
  job_order_id: z.number().min(1),
  reports_title: z.string().min(1),
  remarks: z.string().min(1),
});

export const UpdateReports = z.object({
  job_order_id: z.number().min(1),
  reports_title: z.string().min(1),
  remarks: z.string().min(1),
});

export type CreateReports = z.infer<typeof CreateReports>;
export type UpdateReports = z.infer<typeof UpdateReports>;
