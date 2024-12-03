import {z} from 'zod';

export const orderLogsSchema = z.object({
	order_logs_id: z.number().optional(),
	order_id: z.number().optional(),
	title: z.string(),
	message: z.string(),
	created_at: z.string(),
});
export type OrderLogs = z.infer<typeof orderLogsSchema>;
