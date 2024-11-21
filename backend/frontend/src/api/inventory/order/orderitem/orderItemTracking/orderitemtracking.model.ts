import { z } from 'zod';
export const trackSchema = z.object({
  tag: z.string().min(1),
  status: z.string(),
  quantity: z.number().positive(),
  remarks: z.string().optional(),
});

export type Track = z.infer<typeof trackSchema>;

export const createOrderTrackingSchema = z.object({
  track_record: z.array(trackSchema),
  product_name: z.string().min(1),
  quantity: z.string().min(1),
});
export type CreateOrderItemTracking = z.infer<typeof createOrderTrackingSchema>;

export const updateOrderTrackingSchema = z.object({
  condition: z.string().min(1),
  status: z.string(),
  quantity: z.string(),
  remarks: z.string().optional(),
});
export type UpdateOrderItemTracking = z.infer<typeof updateOrderTrackingSchema>;
