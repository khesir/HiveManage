import { z } from 'zod';

export const CreateService = z.object({
  sales_id: z.number().min(1),
  service_title: z.string().min(1),
  service_description: z.string().min(1),
  service_status: z.enum(['Active', 'Inactive']),
  has_reservation: z.boolean(),
  has_sales_item: z.boolean(),
  has_borrow: z.boolean(),
  has_job_order: z.boolean(),
});

export const UpdateService = z.object({
  sales_id: z.number().min(1),
  service_title: z.string().min(1),
  service_description: z.string().min(1),
  service_status: z.enum(['Active', 'Inactive']),
  has_reservation: z.boolean(),
  has_sales_item: z.boolean(),
  has_borrow: z.boolean(),
  has_job_order: z.boolean(),
});

export type CreateService = z.infer<typeof CreateService>;
export type UpdateService = z.infer<typeof UpdateService>;
