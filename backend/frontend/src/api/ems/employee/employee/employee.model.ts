import z from 'zod';

export const CreateEmployee = z.object({
  firstname: z.string().min(1),
  middlename: z.string().min(1).optional(),
  lastname: z.string().min(1),
  email: z.string().min(1),
  status: z.string().min(1).optional(),
});

export type CreateEmployee = z.infer<typeof CreateEmployee>;

export const UpdateEmployee = z.object({
  firstname: z.string().min(1).optional(),
  middlename: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  email: z.string().min(1),
  status: z.string().min(1).optional(),
});

export type UpdateEmployee = z.infer<typeof UpdateEmployee>;
