import { z } from 'zod';

export const CreateEmployeeLog = z.object({
  employee_id: z.number(),
  action: z.string(),
  quantity: z.number(),
  performed_by_id: z.number(),
  timestamp: z.date().default(() => new Date()),
});

export const UpdateEmployeeLog = z.object({
  employee_id: z.number(),
  action: z.string(),
  quantity: z.number(),
  performed_by_id: z.number(),
  timestamp: z.date().default(() => new Date()),
});

export type CreateEmployeeLog = z.infer<typeof CreateEmployeeLog>;
export type UpdateEmployeeLog = z.infer<typeof UpdateEmployeeLog>;
