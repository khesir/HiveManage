import z from 'zod';

export const CreateEmployee = z.object({
  position_id: z.number().min(1),
  firstname: z.string().min(1),
  middlename: z.string().optional(),
  lastname: z.string().min(1),
  email: z.string().min(1),
});

export type CreateEmployee = z.infer<typeof CreateEmployee>;

export const UpdateEmployee = z.object({
  remove_image: z.string().min(1),
  profile_link: z.string().optional(),
  role_id: z.string().optional(),
  position_id: z.string().optional(),
  firstname: z.string().optional(),
  middlename: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().optional(),
});

export type UpdateEmployee = z.infer<typeof UpdateEmployee>;
