import { z } from 'zod';

export const CreateEmployeeRole = z.object({
  name: z.string().min(1),
  access_level: z.number().min(1),
});

export const UpdateEmployeeRole = z.object({
  name: z.string().min(1),
  access_level: z.number().min(1),
});

export type CreateEmployeeRole = z.infer<typeof CreateEmployeeRole>;
export type UpdateEmployeeRole = z.infer<typeof UpdateEmployeeRole>;
