import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export const signupSchema = z.object({
  employee_id: z.number().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
  salt: z.string().min(1),
});

export type Login = z.infer<typeof loginSchema>;

export type Signup = z.infer<typeof signupSchema>;
