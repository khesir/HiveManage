import { z } from 'zod';

export const CreateOwnedServiceItems = z.object({
  service_owned_id: z.number().optional(),
  service_id: z.number().min(1),
  item_description: z.string().optional().nullable(),
  serial_number: z.string(),
  brand: z.string(),
  model: z.string(),
  notes: z.string(),
});

export const UpdateOwnedServiceItems = z.object({
  service_owned_id: z.number().optional(),
  service_id: z.number().min(1),
  item_description: z.string().optional().nullable(),
  serial_number: z.string(),
  brand: z.string(),
  model: z.string(),
  notes: z.string(),
});

export type CreateOwnedServiceItems = z.infer<typeof CreateOwnedServiceItems>;
export type UpdateOwnedServiceItems = z.infer<typeof UpdateOwnedServiceItems>;
