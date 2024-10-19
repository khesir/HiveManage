import { z } from 'zod';

export const CreateService = z.object({
  sales_id: z.number().min(1),
  service_title: z.string().min(1),
  service_type: z.enum([
    'Repair',
    'Sell',
    'Buy',
    'Borrow',
    'Return',
    'Exchange',
  ]),
  has_sales_item: z.boolean(),
  has_borrow: z.boolean(),
  has_job_order: z.boolean(),
});

export const UpdateService = z.object({
  sales_id: z.number().min(1),
  service_title: z.string().min(1),
  service_type: z.enum([
    'Repair',
    'Sell',
    'Buy',
    'Borrow',
    'Return',
    'Exchange',
  ]),
  has_sales_item: z.boolean(),
  has_borrow: z.boolean(),
  has_job_order: z.boolean(),
});

export type CreateService = z.infer<typeof CreateService>;
export type UpdateService = z.infer<typeof UpdateService>;
