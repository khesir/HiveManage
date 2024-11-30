import {z} from 'zod';
export const orderTrackItemSchema = z.object({
	orderItem_id: z.string().optional(),
	condition: z.string().min(1),
	status: z.string().min(1),
	quantity: z.string().min(1),
	remarks: z.string().optional(),
});
export type OrderTrackItem = z.infer<typeof orderTrackItemSchema>;

export const orderTrackItemArraySchema = z.object({
	track_record: z.array(orderTrackItemSchema),
});
export type OrderTrackItemArray = z.infer<typeof orderTrackItemArraySchema>;
