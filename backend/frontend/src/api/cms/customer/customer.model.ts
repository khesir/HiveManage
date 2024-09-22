import { z } from 'zod';

export const CreateCustomer = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  contact_phone: z.number().min(1),
  socials: z.string().min(1),
  address_line: z.string().min(1),
  barangay: z.string().min(1),
  province: z.string().min(1),
  standing: z.string().min(1),
});

export const UpdateCustomer = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  contact_phone: z.number().min(1),
  socials: z.string().min(1),
  address_line: z.string().min(1),
  barangay: z.string().min(1),
  province: z.string().min(1),
  standing: z.string().min(1),
});

export type CreateCustomer = z.infer<typeof CreateCustomer>;
export type UpdateCustomer = z.infer<typeof UpdateCustomer>;
