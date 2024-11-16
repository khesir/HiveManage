import {z} from 'zod';
import {Product} from './product';
import {EmployeeWithDetails} from '@/modules/ems/_components/validation/employee';

export const stockLogsSchema = z.object({
	stock_logs_id: z.number().optional(),
	product_id: z.number().min(1),
	employee_id: z.number().min(1),
	quantity: z.number().min(1),
	movement_type: z.string().min(1),
	action: z.string().min(1),
});

export type StockLogsWithDetails = {
	stock_logs_id: number;
	product_id: number;
	employee_id: number;
	quantity: number;
	movement_type: string;
	action: string;
	created_at?: string;
	product?: Product;
	employee?: EmployeeWithDetails;
};
