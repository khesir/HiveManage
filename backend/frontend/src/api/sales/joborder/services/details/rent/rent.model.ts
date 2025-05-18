import { z } from 'zod';

export const CreateRent = z.object({
  rent_id: z.number().optional(),
  service_id: z.number(),
  rented_items: z.array(z.number()).default([]),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  deposit: z.string().min(0),
  returned: z.boolean().default(false),
});
export const UpdateRent = z.object({
  rent_id: z.number().optional(),
  service_id: z.number().optional(),
  rented_items: z.array(z.number()).default([]),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  deposit: z.string().min(0),
  returned: z.boolean().default(false),
});
export type CreateRent = z.infer<typeof CreateRent>;
export type UpdateRent = z.infer<typeof UpdateRent>;
