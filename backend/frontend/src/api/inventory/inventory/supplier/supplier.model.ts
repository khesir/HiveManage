import { z } from 'zod';

// validation Schema
export const CreateSupplier = z.object({
  name: z.string().min(1),
  contact_number: z.number().min(1),
  remarks: z.string().min(1),
});

export const UpdateSupplier = z.object({
  name: z.string().min(1),
  contact_number: z.number().min(1),
  remarks: z.string().min(1),
});

export type CreateSupplier = z.infer<typeof CreateSupplier>;
export type UpdateSupplier = z.infer<typeof UpdateSupplier>;
