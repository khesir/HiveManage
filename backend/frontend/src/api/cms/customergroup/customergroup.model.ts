import { z } from 'zod';

export const CreateCustomerGroup = z.object({
  name: z.string().min(1),
});

export const UpdateCustomerGroup = z.object({
  name: z.string().min(1),
});

export type CreateCustomerGroup = z.infer<typeof CreateCustomerGroup>;
export type UpdateCustomerGroup = z.infer<typeof UpdateCustomerGroup>;
