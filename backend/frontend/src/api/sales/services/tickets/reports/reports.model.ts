import { z } from 'zod';

export const CreateReports = z.object({
  service_id: z.number().min(1),
  reports_title: z.string().min(1),
  tickets: z.string().min(1),
});

export const UpdateReports = z.object({
  service_id: z.number().min(1),
  reports_title: z.string().min(1),
  tickets: z.string().min(1),
});

export type CreateReports = z.infer<typeof CreateReports>;
export type UpdateReports = z.infer<typeof UpdateReports>;
