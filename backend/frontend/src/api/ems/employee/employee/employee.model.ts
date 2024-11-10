import z from 'zod';

export const CreateEmployee = z.object({
  firstname: z.string().min(1),
  middlename: z.string().optional(),
  lastname: z.string().min(1),
  email: z.string().min(1),
  profile_link: z.string().optional(),
});

export type CreateEmployee = z.infer<typeof CreateEmployee>;

export const UpdateEmployee = z.object({
  firstname: z.string().optional(),
  middlename: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().optional(),
  profile_link: z.string().optional(),
});

export type UpdateEmployee = z.infer<typeof UpdateEmployee>;
