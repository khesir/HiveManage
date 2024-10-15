import { z } from 'zod';

export const CreateBenefits = z.object({
  employee_id: z.number().optional(),
  name: z.string().min(1),
  start: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  end: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  benefits_type: z.string().min(1),
  frequency: z.string().min(1),
  amount: z.number().min(1),
  description: z.string().min(1),
});

export const UpdateBenefits = z.object({
  name: z.string().min(1),
  start: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  end: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  benefits_type: z.string().min(1),
  frequency: z.string().min(1),
  amount: z.number().min(1),
  description: z.string().min(1),
});

export type CreateBenefits = z.infer<typeof CreateBenefits>;
export type UpdateBenefits = z.infer<typeof UpdateBenefits>;
