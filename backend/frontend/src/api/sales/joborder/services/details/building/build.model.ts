import { z } from 'zod';

export const CreateBuild = z.object({
  build_id: z.number().optional(),
  service_id: z.number(),
  customer_items: z.array(z.number()).default([]),
  parts_used: z.array(z.number()).default([]),
  build_specs: z.string(),
  checklist: z.string(),
});
export const UpdateBuild = z.object({
  build_id: z.number().optional(),
  service_id: z.number().optional(),
  customer_items: z.array(z.number()).default([]),
  parts_used: z.array(z.number()).default([]),
  build_specs: z.string(),
  checklist: z.string(),
});
export type CreateBuild = z.infer<typeof CreateBuild>;
export type UpdateBuild = z.infer<typeof UpdateBuild>;
