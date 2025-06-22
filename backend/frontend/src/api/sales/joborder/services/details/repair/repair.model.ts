import { z } from 'zod';

export const CreateRepair = z.object({
  repair_details_id: z.number().optional(),
  service_id: z.number(),
  parts_used: z.array(z.number()).default([]),
  diagnostic_notes: z.string().optional().nullable(),
  work_done: z.string().optional().nullable(),
});
export const UpdateRepair = z.object({
  repair_details_id: z.number().optional(),
  service_id: z.number().optional(),
  parts_used: z.array(z.number()).default([]),
  diagnostic_notes: z.string().optional().nullable(),
  work_done: z.string().optional().nullable(),
});
export type CreateRepair = z.infer<typeof CreateRepair>;
export type UpdateRepair = z.infer<typeof UpdateRepair>;
