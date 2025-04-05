import { z } from 'zod';

export const CreateServiceLog = z.object({
  service_id: z.number(),
  ticket_id: z.number(),
  report_id: z.number(),
  service_item_id: z.number(),
  payment_id: z.number(),
  action: z.string(),
  quantity: z.number(),
  performed_by_id: z.number(),
  timestamp: z.date().default(() => new Date()),
});

export const UpdateServiceLog = z.object({
  service_id: z.number(),
  ticket_id: z.number(),
  report_id: z.number(),
  service_item_id: z.number(),
  payment_id: z.number(),
  action: z.string(),
  quantity: z.number(),
  performed_by_id: z.number(),
  timestamp: z.date().default(() => new Date()),
});

export type CreateServiceLog = z.infer<typeof CreateServiceLog>;
export type UpdateServiceLog = z.infer<typeof UpdateServiceLog>;
