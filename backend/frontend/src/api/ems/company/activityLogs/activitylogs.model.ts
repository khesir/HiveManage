import { z } from 'zod';

// Validation Schema
export const ActivityLog = z.object({
  employee_id: z.number().min(1),
  action: z.string().min(1),
});

export const ActivityLogParamId = z.object({
  activity_id: z.string(),
});
export type ActivityLog = z.infer<typeof ActivityLog>;
