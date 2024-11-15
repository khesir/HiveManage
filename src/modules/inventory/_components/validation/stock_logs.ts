import {z} from 'zod';
import {Product} from './product';

export const stockLogsSchema = z.object({
	stock_logs_id: z.number().optional(),
	product_id: z.number().min(1),
	quantity: z.number().min(1),
	movement_type: z.string().min(1),
	action: z.string().min(1),
});

export type StockLogsWithDetails = {
	stock_logs_id: number;
	product: Product;
	quantity: number;
	movement_type: string;
	action: string;
	created_at?: string;
};
