import {z} from 'zod';
import {JobOrderWithDetails} from './joborder';

export const reportsSchema = z.object({
	reports_id: z.number().optional(),
	job_order_id: z.number().optional(),
	reports_title: z.string().min(1),
	remarks: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type Reports = z.infer<typeof reportsSchema>;

export type ReportsWithDetails = {
	reports_id?: number;
	job_order: JobOrderWithDetails;
	reports_title: string;
	remarks: string;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
};
