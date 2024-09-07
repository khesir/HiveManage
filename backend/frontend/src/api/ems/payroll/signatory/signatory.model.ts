import { z } from 'zod';

export const CreateSignatory = z.object({
  employee_id: z.number().min(1),
  signatory_name: z.string().min(1),
  role: z.string().min(1),
  permission_level: z.number().min(1), 
});

export type CreateSignatoryData = z.infer<typeof CreateSignatory>;

export const UpdateSignatory = z.object({
  employee_id: z.number().min(1).optional(),
  signatory_name: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  permission_level: z.number().optional(),
});

export type UpdateSignatoryData = z.infer<typeof UpdateSignatory>;