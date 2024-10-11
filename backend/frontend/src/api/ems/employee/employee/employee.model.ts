import z from 'zod';

export const Employee = z.object({
  uuid: z.string().min(1).optional(),
  firstname: z.string().min(1),
  middlename: z.string().min(1).optional(),
  lastname: z.string().min(1),
  status: z.string().min(1).optional(),
});

export type Employee = z.infer<typeof Employee>;

export const UpdateEmployee = z.object({
  uuid: z.string().min(1).optional(),
  firstname: z.string().min(1).optional(),
  middle: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
});

export type UpdateEmployee = z.infer<typeof UpdateEmployee>;
