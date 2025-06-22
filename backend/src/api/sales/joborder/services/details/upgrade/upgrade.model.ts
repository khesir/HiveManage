import { z } from 'zod';

export const CreateUpgrade = z.object({
  upgrade_id: z.number().optional(),
  service_id: z.number(),
  before_specs: z.array(z.number()).default([]),
  upgraded_components: z.array(z.number()).default([]),
  notes: z.string().optional().nullable(),
});
export const UpdateUpgrade = z.object({
  upgrade_id: z.number().optional(),
  service_id: z.number().optional(),
  before_specs: z.array(z.number()).default([]),
  upgraded_components: z.array(z.number()).default([]),
  notes: z.string().optional().nullable(),
});
export type CreateUpgrade = z.infer<typeof CreateUpgrade>;
export type UpdateUpgrade = z.infer<typeof UpdateUpgrade>;
