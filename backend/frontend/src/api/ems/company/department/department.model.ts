import { z } from 'zod';

export const CreateDepartment = z.object({
  name: z.string().min(1),
  status: z.string().min(1),
});

export type CreateDepartment = z.infer<typeof CreateDepartment>;
export const UpdateDepartment = z.object({
  name: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
});

export type UpdateDepartment = z.infer<typeof UpdateDepartment>;
